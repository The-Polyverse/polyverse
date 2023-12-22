import { AnyAction, EntityState } from "@reduxjs/toolkit";
import Message from "./message";

export type EntityStates = EntityState<Message>;

export enum EntityType {
  Messages = "messages",
}
export type EntityUnionType = (typeof EntityType)[keyof typeof EntityType];

export type State = {
  crudActions: {
    actions: Array<{
      payload: {
        type: EntityType;
        action: AnyAction;
      };
      type: "transaction/wrap";
    }>;
    last: {
      payload: {
        type: EntityType;
        action: AnyAction;
      };
      type: "transaction/wrap";
    } | null;
  };
  transactions: "idle" | "started";
} & { [K in EntityType]: EntityStates };
