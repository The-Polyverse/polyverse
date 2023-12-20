import { EntityId, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import Message from "../../types/message";
import { State } from "../../types/state";
// import { RootState } from "../store";

export default function createMessageEntity() {
  const entity = createEntityAdapter<Message>();

  const {
    selectById: selectMessageById,
    selectIds: selectMessageIds,
    selectEntities: selectMessageEntities,
    selectAll: selectAllMessages,
    selectTotal: selectTotalMessages,
  } = entity.getSelectors((state: State) => state.messages);

  const selectMessagesByIds = createSelector(
    [selectAllMessages, selectMessageIds, (_, ids: EntityId[]) => ids],
    (allMessages, allIds, ids) =>
      allMessages.filter((message) =>
        ids.filter((id) => allIds.includes(id)).includes(message.id!)
      )
  );

  const selectors = {
    selectMessageById,
    selectMessageIds,
    selectMessageEntities,
    selectAllMessages,
    selectTotalMessages,
    selectMessagesByIds,
  };

  return {
    selectors,
    entity
  }
}