import {
  Action,
  AnyAction,
  EntityId,
  Middleware,
  PayloadAction,
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

import createMessageEntity from "./messages/entity";
import createMessagesSlice from "./messages/slice";

const initialState: State = {
  messages: createMessageEntity().entity.getInitialState(),
  crudActions: { actions: [], last: null },
  transactions: "idle",
};

export const startTransaction = createAction("transaction/start");
export const commitTransaction = createAction("transaction/commit");
export const rollbackTransaction = createAction("transaction/rollback");

export const addOne = createAction<Entity>("entity/addOne");
export const updateOne = createAction<Update<Entity>>("entity/updateOne");
export const removeOne = createAction<EntityId>("entity/removeOne");
export const addMany = createAction<Entity[]>("entity/addMany");
export const updateMany = createAction<Update<Entity>[]>("entity/updateMany");
export const removeMany = createAction<EntityId[]>("entity/removeMany");

// TODO: change this to make it compatible with all the CRUD actions
export const runTransaction = createAsyncThunk(
  "service/entity/add",
  async (entity: Entity, thunkApi) => {
    const { dispatch } = thunkApi;

    dispatch(addOne(entity));
  }
);

const wrapInTransaction = createAction(
  "transaction/wrap",
  // TODO: Wrap each entity action to include transaction id
  (action: AnyAction) => {
    return { payload: action.payload };
  }
);

const noop = createAction("noop");

export default function createStore(preloadedState: State = initialState) {
  const entitiesSlice = createMessagesSlice(preloadedState.messages);
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

    effect: (action, listenerApi) => {
      // TODO: include transaction uuid
      listenerApi.dispatch(startTransaction());

      try {
        const { actions } = entitiesSlice;

        const actionMap = new Map<AnyAction, AnyAction>([
          [addOne, wrapInTransaction(actions.addOne)],
          [updateOne, wrapInTransaction(actions.updateOne)],
          [removeOne, wrapInTransaction(actions.removeOne)],
          [addMany, wrapInTransaction(actions.addMany)],
          [updateMany, wrapInTransaction(actions.updateMany)],
          [removeMany, wrapInTransaction(actions.removeMany)],
        ]);

        const actionHandler = actionMap.get(action);

        if (actionHandler == null) {
          throw new Error("Unknown action");
        }

        listenerApi.dispatch(actionHandler);
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
      actions: Action[];
      last: Action | null;
    },
    reducers: {
      push: (state, action: PayloadAction<Action>) => {
        state.actions.push(action.payload);
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
      const entities = entitiesSlice.actions;

      if (selectTransactionStarted(getState())) {
        if (wrapInTransaction.match(action)) {
          // save action for when the transaction is committed
          void (async () => dispatch(actions.push(action)))();

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

              try {
                dispatch(selectLastAction(state)!);
              } catch (error) {
                console.error(error);

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

  const store = configureStore({
    preloadedState,
    reducer: {
      transactions,

      messages: entitiesSlice.reducer,
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
