import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { transformDocToMessage } from "../api/baseQuery";
import counterReducer from "../features/counter/counterSlice";
import createMessagesSlice, { selectById } from "../features/message/messageSlice";
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
    actions: { removeMessageNoSync, upsertOne },
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
      const exists = selectById(store.getState().messages, change.id);
      store.dispatch(removeMessageNoSync(change.id));
      store.dispatch(messageApi.util.invalidatesTags([{ type: 'Message', id: change.id }]));
    } else {
      const message = transformDocToMessage(change.doc!);
      if (change.id) {
        store.dispatch(upsertOne({ id: change.id, ...message }));
        store.dispatch(messageApi.util.invalidatesTags([{ type: 'Message', id: change.id }]));
      } else {
        throw Error("Database changeset without id");
      }
    }
  });

  return store;
}

export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
export type RootState = ReturnType<typeof createStore>["getState"];
