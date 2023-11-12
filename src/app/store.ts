// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import createMessagesSlice from "../features/message/messageSlice";
import type { MessageEntity } from "../features/message/messageSlice";
import { messageApi } from "../api/messagesApi";
import { setupListeners } from "@reduxjs/toolkit/query";

type PreloadedState = {
  messages: MessageEntity;
};

export function createStore(preloadedState: PreloadedState) {
  const { reducer: messagesReducer } = createMessagesSlice(
    preloadedState.messages
  );
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      messages: messagesReducer,
      [messageApi.reducerPath]: messageApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(messageApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
}

export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
export type RootState = ReturnType<typeof createStore>["getState"];
