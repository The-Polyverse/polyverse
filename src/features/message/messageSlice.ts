import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import Message from '../../models/message';

const messagesAdapter = createEntityAdapter<Message>();

export default function createMessagesSlice(preloadedState = {}) {
  const initialState = messagesAdapter.getInitialState(preloadedState);
  return createSlice({
    name: 'messages',
    initialState: initialState,
    reducers: {
      addMessage: (state, action) => {
        return messagesAdapter.addOne(state, { id: '3', ...action.payload });
      },
      updateMessage: messagesAdapter.updateOne,
      removeMessage: messagesAdapter.removeOne,
    },
  });
}

export type MessageEntity = {
  ids: string[];
  entities: {
    [key: string]: Message
  }
};

export const {
  selectById: selectMessageById,
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntities,
  selectAll: selectAllMessages,
  selectTotal: selectTotalMessages,
} = messagesAdapter.getSelectors((state: { messages: MessageEntity }) => state.messages);
