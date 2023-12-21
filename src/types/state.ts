import { Action } from "@reduxjs/toolkit";
import type { MessageEntity } from "./message";

export type State = {
  messages: MessageEntity;
  domainEvents: { actions: Action[], last: Action | null};
  transactions: "idle" | "pending";
};
