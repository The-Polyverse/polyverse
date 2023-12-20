import { EntityState, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { CurriedGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import { setupListeners } from "@reduxjs/toolkit/query";
import type { State } from "../types/state";
import createMessageSlice from "./messages/slice";
import Message from "../types/message";

export default function createStore() {
  const preloadedState: State = {
    messages: {
      ids: [],
      entities: {},
    },
  };

  const { reducer: messageReducer } = createMessageSlice(
    preloadedState.messages
  );

  const listenerMiddleware = createListenerMiddleware();
  
  const middleware = (
    current: CurriedGetDefaultMiddleware<{
      messages: EntityState<Message>;
    }>
  ) => current().prepend(listenerMiddleware.middleware);

  const reducer = {
    messages: messageReducer,
  };

  const store = configureStore({
    reducer,
    preloadedState,
    middleware,
  });

  setupListeners(store.dispatch);

  return store;
}
