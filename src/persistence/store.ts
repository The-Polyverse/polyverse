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
import createMessagesSlice from "./messages/slice";
import createCache from "./cache";

const initialState: State = {
  messages: {
    ids: [],
    entities: {},
  },
  domainEvents: { actions: [], last: null },
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

export const addOneService = createAsyncThunk(
  "service/entity/add",
  async (entity: Entity, thunkApi) => {
    const { dispatch } = thunkApi;

    dispatch(addOne(entity));
  }
);

export default function createStore(preloadedState: State = initialState) {
  const messages = createMessagesSlice(preloadedState.messages);
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
      listenerApi.dispatch(startTransaction());

      try {
        const { actions } = messages;

        const actionMap = new Map<AnyAction, AnyAction>([
          [addOne, actions.addOne],
          [updateOne, actions.updateOne],
          [removeOne, actions.removeOne],
          [addMany, actions.addMany],
          [updateMany, actions.updateMany],
          [removeMany, actions.removeMany],
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

  const domainEvents = createSlice({
    name: "domainEvents",
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

  const transactionMiddleware: Middleware =
    ({ getState, dispatch }) =>
    (next) =>
    (action) => {
      const { push, shift, clear } = domainEvents.actions;
      const {
        addOne,
        updateOne,
        removeOne,
        addMany,
        updateMany,
        removeMany,
        reset,
      } = messages.actions;
      const isCrudAction = isAnyOf(
        addOne,
        updateOne,
        removeOne,
        addMany,
        updateMany,
        removeMany
      );
      const transactionStarted = getState().transactions == "started";
      const committing = commitTransaction.match(action);
      const rollingBack = rollbackTransaction.match(action);

      if (isCrudAction(action) && transactionStarted) {
        dispatch(push(action));
      } else if (transactionStarted && committing) {
        // we need to update the state to 'idle' before being able to dispatch the domain events
        next(action);

        // save a copy of the state before dispatching the domain events
        const originalState = getState();
        let state = originalState;

        // dispatch the domain events, one by one, and rollback if any one of them fails
        while (state.actions.length > 0) {
          dispatch(shift());

          state = getState();

          try {
            dispatch(state.domainEvents.last);
          } catch (error) {
            console.error(error);

            dispatch(reset(originalState.messages));
            dispatch(rollbackTransaction());
          }
        }
      } else if (transactionStarted && rollingBack) {
        dispatch(clear());
        next(action);
      } else {
        next(action);
      }
    };

  const cache = createCache();

  const store = configureStore({
    preloadedState,
    reducer: {
      transactions,

      messages: messages.reducer,
      domainEvents: domainEvents.reducer,

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
