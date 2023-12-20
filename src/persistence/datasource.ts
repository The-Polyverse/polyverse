import { EntityStore } from "@dipscope/entity-store";
import { InMemoryEntityProvider } from "@dipscope/in-memory-entity-provider";
import Message from "../types/message";

export class EntityDatasource extends EntityStore {
  public readonly messages;

  public constructor() {
    super(new InMemoryEntityProvider());
    this.messages = this.createEntitySet<Message>(Message);
  }
}

export const entityDatasource = new EntityDatasource();
