/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TypeManager,
  TypeMetadata,
  TypeConfiguration,
} from "@dipscope/type-manager";
import { EntityId } from "@reduxjs/toolkit";

class Message {
  public constructor(
    public readonly id: string | null,
    public readonly content: string
  ) {}
}

export default Message;

export class MessageConfiguration implements TypeConfiguration<Message> {
  public configure(typeMetadata: TypeMetadata<Message>): void {
    typeMetadata.configurePropertyMetadata("id").hasTypeArgument(String);
    typeMetadata.configurePropertyMetadata("content").hasTypeArgument(String);
  }
}

TypeManager.applyTypeConfiguration(Message, new MessageConfiguration());

export type MessageEntity = {
  ids: EntityId[];
  entities: {
    [key: string]: Message;
  };
}
