import { EntityState, createSlice } from "@reduxjs/toolkit";
import Message from "../../types/message";
import createMessageEntity from "./entity";

const initialState: EntityState<Message> = {
  ids: [],
  entities: {},
};

export default function createMessageSlice(state: EntityState<Message> = initialState) {
  const { entity } = createMessageEntity();
  const slice = createSlice({
    name: "messages",
    initialState: entity.getInitialState(state),
    reducers: {
      addMessage: entity.addOne,
      updateMessage: entity.updateOne,
      removeMessage: entity.removeOne,
      addMessages: entity.addMany,
      updateMessages: entity.updateMany,
      removeMessages: entity.removeMany,
      upsertOne: entity.upsertOne,
    },
  });

  return slice;
}
