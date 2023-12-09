import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import counterReducer from "../features/counter/counterSlice";
import createMessagesSlice from "../features/message/messageSlice";
import type { MessageEntity } from "../features/message/messageSlice";
import { messageApi } from "../api/messagesApi";
import listenerMiddleware from "../listeners/listenerMiddleware";

import "../listeners/messageListener";

type PreloadedState = {
  messages: MessageEntity;
};

export function createStore(preloadedState: PreloadedState) {
  const {
    reducer: messagesReducer,
  } = createMessagesSlice(preloadedState.messages);
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      messages: messagesReducer,
      [api.reducerPath]: api.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(api.middleware);
    },
  });

  setupListeners(store.dispatch);
  
  return store;
}

export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
