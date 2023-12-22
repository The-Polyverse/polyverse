import { EntityType } from "../types/state";
import createMessagesSlice from "./messages/slice";

export default function entitySliceFactories() {
  return {
    [EntityType.Messages]: createMessagesSlice,
  };
}
