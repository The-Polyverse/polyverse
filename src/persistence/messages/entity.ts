import { EntityId, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import Message from "../../types/message";
import { State } from "../../types/state";

export default function createMessageEntity() {
  const entity = createEntityAdapter<Message>();

  const {
    selectById,
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = entity.getSelectors((state: State) => state.messages);

  const selectByIds = createSelector(
    [selectAll, selectIds, (_, ids: EntityId[]) => ids],
    (allMessages, allIds, ids) =>
      allMessages.filter((message) =>
        ids.filter((id) => allIds.includes(id)).includes(message.id!)
      )
  );

  const selectors = {
    selectById,
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
    selectByIds,
  };

  return {
    ...entity,
    selectors,
  }
}