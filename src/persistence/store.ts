import {
  configureStore,
  createAction,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { State } from "../types/state";
import { setupListeners } from "@reduxjs/toolkit/query";
import createMessageSlice from "./messages/slice";
import createCache from "./cache";

const initialState: State = {
  messages: {
    ids: [],
    entities: {},
  },
};

export const startTransaction = createAction("transaction/start");
export const commitTransaction = createAction("transaction/commit");
export const rollbackTransaction = createAction("transaction/rollback");

export const addEntity = createAction("entity/add");
export const updateEntity = createAction("entity/update");
export const removeEntity = createAction("entity/remove");
export const addEntities = createAction("entities/add");
export const updateEntities = createAction("entities/update");
export const removeEntities = createAction("entities/remove");

export default function createStore(preloadedState: State = initialState) {
  const messageSlice = createMessageSlice(preloadedState.messages);
  const cache = createCache();
  const listener = createListenerMiddleware();

  listener.startListening({
    matcher: isAnyOf(
      addEntity,
      updateEntity,
      removeEntity,
      addEntities,
      updateEntities,
      removeEntities
    ),
    
    effect: (action, listenerApi) => {
      listenerApi.dispatch(startTransaction());
      try {
        const { resource, method, record, records, id, ids } = action.payload;
        console.log({ resource, method, record, records, id, ids });
        listenerApi.dispatch(commitTransaction());
      } catch (error) {
        console.error(error);
        listenerApi.dispatch(rollbackTransaction());
      }
    },
  });

  const store = configureStore({
    preloadedState,
    reducer: {
      messages: messageSlice.reducer,
      [cache.reducerPath]: cache.reducer,
    },
    middleware: (current) =>
      current().prepend(listener.middleware).concat(cache.middleware),
  });

  setupListeners(store.dispatch);

  return store;
}
