// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import createMessagesSlice from '../features/message/messageSlice';
import type { MessageEntity } from '../features/message/messageSlice';

type PreloadedState = {
  messages: MessageEntity;
};

export function createStore(preloadedState: PreloadedState) {
  const { reducer: messagesReducer } = createMessagesSlice(preloadedState.messages);
  return configureStore({
    reducer: {
      counter: counterReducer,
      messages: messagesReducer,
    },
    preloadedState,
  });
}
