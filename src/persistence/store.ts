import {
  Action,
  AnyAction,
  EntityId,
  Middleware,
  Reducer,
  Update,
  configureStore,
  createAction,
  createAsyncThunk,
  createListenerMiddleware,
  createReducer,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import type { State, Entity } from "../types";
import createCache from "./cache";

import { EntityStates, EntityType, EntityUnionType } from "../types/state";
import entitySliceFactories from "./entities";

export const startTransaction = createAction("transaction/start");
export const commitTransaction = createAction("transaction/commit");
export const rollbackTransaction = createAction("transaction/rollback");

// single entity CRUD actions
export const addOne = createAction<{ type: EntityUnionType; entity: Entity }>(
  "entity/addOne"
);

export const updateOne = createAction<{
  type: EntityUnionType;
  update: Update<Entity>;
}>("entity/updateOne");

export const removeOne = createAction<{ type: EntityUnionType; id: EntityId }>(
  "entity/removeOne"
);

// multiple entity CRUD actions
export const addMany = createAction<{
  type: EntityUnionType;
  entities: Entity[];
}>("entity/addMany");

export const updateMany = createAction<{
  type: EntityUnionType;
  updates: Update<Entity>[];
}>("entity/updateMany");

export const removeMany = createAction<{
  type: EntityUnionType;
  ids: EntityId[];
}>("entity/removeMany");

export type EntityAction =
  | {
      type: EntityUnionType;
      entity: Entity;
    }
  | {
      type: EntityUnionType;
      update: Update<Entity>;
    }
  | {
      type: EntityUnionType;
      id: EntityId;
    }
  | {
      type: EntityUnionType;
      entities: Entity[];
    }
  | {
      type: EntityUnionType;
      updates: Update<Entity>[];
    }
  | {
      type: EntityUnionType;
      ids: EntityId[];
    };

export const runTransaction = createAsyncThunk(
  "transaction/run",
  async (entityAction: EntityAction, thunkApi) => {
    const { dispatch } = thunkApi;

    if ("entity" in entityAction) {
      return dispatch(addOne(entityAction));
    } else if ("update" in entityAction) {
      return dispatch(updateOne(entityAction));
    } else if ("id" in entityAction) {
      return dispatch(removeOne(entityAction));
    } else if ("entities" in entityAction) {
      return dispatch(addMany(entityAction));
    } else if ("updates" in entityAction) {
      return dispatch(updateMany(entityAction));
    } else if ("ids" in entityAction) {
      return dispatch(removeMany(entityAction));
    }

    throw new Error("Not implemented");
  }
);

const wrapInTransaction = createAction(
  "transaction/wrap",
  // TODO: Wrap each entity action to include transaction id
  (type: EntityType, action: AnyAction) => {
    return { payload: { type, action } };
  }
);

const noop = createAction("noop");

export default function createStore(preloadedState: State | undefined) {
  const sliceFactories = entitySliceFactories();
  const entitiesSlice = Object.values(EntityType).reduce(
    (slices, type) => Object.assign(slices, { [type]: sliceFactories[type]() }),
    {} as { [K in EntityType]: ReturnType<(typeof sliceFactories)[EntityType]> }
  );

  if (preloadedState === undefined) {
    const initialEntityStates = Object.values(EntityType).reduce(
      (states, type) =>
        Object.assign(states, {
          [type]: entitiesSlice[type].getInitialState(),
        }),
      {} as { [K in EntityType]: EntityStates }
    );

    const initialState: State = {
      ...initialEntityStates,
      crudActions: { actions: [], last: null },
      transactions: "idle",
    };
    preloadedState = initialState;
  }

  const listener = createListenerMiddleware();

  listener.startListening({
    matcher: isAnyOf(
      addOne,
      updateOne,
      removeOne,
      addMany,
      updateMany,
      removeMany
    ),

    effect: (action: { payload: EntityAction } & Action, listenerApi) => {
      // TODO: include transaction uuid
      listenerApi.dispatch(startTransaction());

      try {
        const { actions: actions } = entitiesSlice[action.payload.type];

        const transactionActionMap = new Map<AnyAction, AnyAction>([
          [addOne, wrapInTransaction(action.payload.type, actions.addOne)],
          [
            updateOne,
            wrapInTransaction(action.payload.type, actions.updateOne),
          ],
          [
            removeOne,
            wrapInTransaction(action.payload.type, actions.removeOne),
          ],
          [addMany, wrapInTransaction(action.payload.type, actions.addMany)],
          [
            updateMany,
            wrapInTransaction(action.payload.type, actions.updateMany),
          ],
          [
            removeMany,
            wrapInTransaction(action.payload.type, actions.removeMany),
          ],
        ]);

        const transactionAction = transactionActionMap.get(action);

        if (transactionAction == null) {
          throw new Error("Unknown action");
        }

        listenerApi.dispatch(transactionAction);
        listenerApi.dispatch(commitTransaction());
      } catch (error) {
        console.error(error);

        listenerApi.dispatch(rollbackTransaction());
      }
    },
  });

  // TODO: Make this into a full fledged entity adapted slice tracking state of individual transactions
  // TODO: Track states `started`, `committing`, `rollingBack`
  const transactions = createReducer("idle", (builder) => {
    builder
      .addCase(startTransaction, (state) =>
        state == "idle" ? "started" : state
      )
      .addCase(commitTransaction, (state) =>
        state == "started" ? "idle" : state
      )
      .addCase(rollbackTransaction, (state) =>
        state == "started" ? "idle" : state
      );
  });

  const selectTransactionStarted = (state: State) =>
    state.transactions == "started";

  // TODO: Track which transaction the events belong to. Rename to `actions`
  const crudActions = createSlice({
    name: "crudActions",
    initialState: { actions: [], last: null } as {
      actions: Array<{
        payload: {
          type: EntityType;
          action: AnyAction;
        };
        type: "transaction/wrap";
      }>;
      last: {
        payload: {
          type: EntityType;
          action: AnyAction;
        };
        type: "transaction/wrap";
      } | null;
    },
    reducers: {
      push: (
        state,
        action: {
          payload: {
            type: EntityType;
            action: AnyAction;
          };
          type: string;
        } & Action
      ) => {
        state.actions.push(action);
      },
      shift: (state) => {
        state.last = state.actions.shift() ?? null;
      },
      clear: (state) => {
        state.actions = [];
        state.last = null;
      },
    },
  });

  const selectActionsNotEmpty = (state: State) =>
    state.crudActions.actions.length > 0;
  const selectLastAction = (state: State) => state.crudActions.last;

  const transactionMiddleware: Middleware =
    ({ getState, dispatch }) =>
    (next) =>
    (action) => {
      const actions = crudActions.actions;

      if (selectTransactionStarted(getState())) {
        if (wrapInTransaction.match(action)) {
          // save action for when the transaction is committed
          void (async () => dispatch(actions.push(action.payload)))();

          // switch out the action for a noop so that it doesn't get dispatched
          return next(noop());
        } else if (commitTransaction.match(action)) {
          // dispatch the original action to to set the transaction
          // state to `idle` so that the next action can be dispatched
          // without being converted to a noop
          const result = next(action);

          void (async () => {
            // save a copy of the state before dispatching the domain events
            const originalState = getState();
            let state = originalState;

            // dispatch the domain events, one by one, and rollback if any one of them fails
            while (selectActionsNotEmpty(state)) {
              dispatch(actions.shift());
              state = getState();

              // `selectActionsNotEmpty` and `shift` ensures this is cannot be null
              const last = selectLastAction(state)!;

              try {
                // unwrap the action and dispatch it
                const {
                  payload: { action },
                } = last;

                dispatch(action);
              } catch (error) {
                console.error(error);

                // restore the state of the entity to what it was before the transaction started
                const {
                  payload: { type },
                } = last;
                const entities = entitiesSlice[type].actions;

                dispatch(entities.reset(originalState.messages));
                dispatch(rollbackTransaction());
              }
            }
          })();
          return result;
        } else if (rollbackTransaction.match(action)) {
          void (async () => dispatch(actions.clear()))();
          return next(action);
        }
      } else {
        return next(action);
      }
    };

  const cache = createCache();

  const entityReducers = Object.values(EntityType).reduce(
    (reducers, type) =>
      Object.assign(reducers, { [type]: entitiesSlice[type].reducer }),
    {} as { [K in EntityType]: Reducer<EntityStates> }
  );

  const store = configureStore({
    preloadedState,
    reducer: {
      transactions,

      ...entityReducers,

      crudActions: crudActions.reducer,

      [cache.reducerPath]: cache.reducer,
    },
    middleware: (current) =>
      current()
        .prepend(transactionMiddleware, listener.middleware)
        .concat(cache.middleware),
  });

  setupListeners(store.dispatch);

  return store;
}
