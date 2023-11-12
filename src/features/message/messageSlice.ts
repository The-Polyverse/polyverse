import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import Message from '../../models/message';

export const messagesAdapter = createEntityAdapter<Message>();

export default function createMessagesSlice(preloadedState = {}) {
  const initialState = messagesAdapter.getInitialState(preloadedState);
  return createSlice({
    name: 'messages',
    initialState: initialState,
    reducers: {
      addMessage: messagesAdapter.addOne,
      updateMessage: messagesAdapter.updateOne,
      removeMessage: messagesAdapter.removeOne,
      removeMessageNoSync: messagesAdapter.removeOne,
      addMessages: messagesAdapter.addMany,
      updateMessages: messagesAdapter.updateMany,
      removeMessages: messagesAdapter.removeMany,
      upsertOne: messagesAdapter.upsertOne,
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

export function selectMessagesByIds(state: { messages: MessageEntity }, ids: string[]): Message[] {
  return ids.map(id => selectMessageById(state, id)).filter(message => message !== undefined) as Message[];
}
