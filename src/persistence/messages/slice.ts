import { EntityState, createSlice } from "@reduxjs/toolkit";
import Message from "../../types/message";
import createMessageEntity from "./entity";

const initialState: EntityState<Message> = {
  ids: [],
  entities: {},
};

export default function createMessagesSlice(
  state: EntityState<Message> = initialState
) {
  const { entity } = createMessageEntity();
  const slice = createSlice({
    name: "messages",
    initialState: entity.getInitialState(state),
    reducers: {
      addOne: entity.addOne,
      updateOne: entity.updateOne,
      removeOne: entity.removeOne,
      addMany: entity.addMany,
      updateMany: entity.updateMany,
      removeMany: entity.removeMany,
      reset: (state, action) => {
        state.ids = action.payload.ids;
        state.entities = action.payload.entities;
      },
    },
  });

  return slice;
}
