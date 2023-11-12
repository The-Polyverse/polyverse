import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { transformDocToMessage } from "../api/baseQuery";
import counterReducer from "../features/counter/counterSlice";
import createMessagesSlice from "../features/message/messageSlice";
import type { MessageEntity } from "../features/message/messageSlice";
import { messageApi, db } from "../api/messagesApi";
import listenerMiddleware from "../listeners/listenerMiddleware";

import "../listeners/messageListener";
import Message from "../models/message";

type PreloadedState = {
  messages: MessageEntity;
};

export function createStore(preloadedState: PreloadedState) {
  const {
    reducer: messagesReducer,
    actions: { removeMessage, addMessage, updateMessage },
  } = createMessagesSlice(preloadedState.messages);
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      messages: messagesReducer,
      [messageApi.reducerPath]: messageApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(messageApi.middleware);
    },
  });

  setupListeners(store.dispatch);

  db.changes({
    since: "now",
    live: true,
    include_docs: true,
  }).on("change", async function (change) {
    if (change.deleted) {
      store.dispatch(removeMessage(change.id));
    } else {
      const message = transformDocToMessage(change.doc!);
      if (change.id) {
        store.dispatch(updateMessage({ id: change.id, changes: message}));
      } else {
        const id = await db.allDocs().then((docs) => String(docs.total_rows + 1));
        store.dispatch(addMessage({ id, ...message } as Message));
      }
    }
  });

  return store;
}

export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
export type RootState = ReturnType<typeof createStore>["getState"];
