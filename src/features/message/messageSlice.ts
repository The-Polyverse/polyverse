import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import Message from "../../models/message";
import { RootState } from "../../app/store";

export const messagesAdapter = createEntityAdapter<Message>();

export default function createMessagesSlice(preloadedState = {}) {
  const initialState = messagesAdapter.getInitialState(preloadedState);
  return createSlice({
    name: "messages",
    initialState: initialState,
    reducers: {
      addMessage: messagesAdapter.addOne,
      updateMessage: messagesAdapter.updateOne,
      removeMessage: messagesAdapter.removeOne,
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
    [key: string]: Message;
  };
};

export const {
  selectById: selectMessageById,
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntities,
  selectAll: selectAllMessages,
  selectTotal: selectTotalMessages,
} = messagesAdapter.getSelectors((state: RootState) => state.messages);

export const selectMessagesByIds = createSelector(
  [selectAllMessages, selectMessageIds, (_: RootState, ids: string[]) => ids],
  (allMessages, allIds, ids) =>
    allMessages.filter((message) =>
      ids.filter((id) => allIds.includes(id)).includes(message.id)
    )
);
