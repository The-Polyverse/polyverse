import { Action, EntityState } from "@reduxjs/toolkit";
import Message from "./message";

export type Entity = EntityState<Message>;

export enum EntityType {
  Messages = "messages",
}

export type State = {
  crudActions: { actions: Action[]; last: Action | null };
  transactions: "idle" | "started";
} & { [K in EntityType]: Entity };
