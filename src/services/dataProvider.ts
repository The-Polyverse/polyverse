import { Store, Update } from "@reduxjs/toolkit";
import Message from "../models/message";
import createMessagesSlice, {
  selectAllMessages,
  selectMessageById,
  selectMessageEntities,
} from "../features/message/messageSlice";
import {
  DataProvider,
  GetListResponse,
  CreateResponse,
  UpdateResponse,
  GetOneResponse,
  CreateManyResponse,
  UpdateManyResponse,
  BaseRecord,
  DeleteManyResponse,
  DeleteOneResponse,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteOneParams,
  DeleteManyParams,
  GetManyParams,
  CreateManyParams,
  UpdateManyParams,
} from "@refinedev/core";

export default function createDataProvider(store: Store): DataProvider {
  const { actions } = createMessagesSlice();

  return {
    getList: async <TData extends BaseRecord>({
      resource,
    }: GetListParams): Promise<GetListResponse<TData>> => {
      if (resource === "messages") {
        const state = store.getState();
        const messages = selectAllMessages(state) as unknown[];
        return { data: messages as TData[], total: messages.length };
      }
      return { data: [], total: 0 };
    },
    getOne: async <TData extends BaseRecord>({
      resource,
      id,
    }: GetOneParams): Promise<GetOneResponse<TData>> => {
      if (resource === "messages") {
        const state = store.getState();
        const message = selectMessageById(state, id) as unknown;
        return { data: message as TData };
      }
      return { data: {} as TData };
    },
    create: async <TData extends BaseRecord, TVariables>({
      resource,
      variables,
    }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
      if (resource === "messages") {
        store.dispatch(actions.addMessage(variables as Message));
        return { data: { ...(variables as object) } as TData };
      }
      return { data: {} as TData };
    },
    update: async <TData extends BaseRecord, TVariables>({
      resource,
      id,
      variables,
    }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
      if (resource === "messages") {
        store.dispatch(
          actions.updateMessage({ id, changes: variables } as Update<Message>)
        );
        return { data: { id, ...(variables as object) } as TData };
      }
      return { data: {} as TData };
    },
    deleteOne: async <TData extends BaseRecord, TVariables>({
      resource,
      id,
    }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
      if (resource === "messages") {
        const message = selectMessageById(store.getState(), id) as unknown;
        store.dispatch(actions.removeMessage(id));
        return { data: message as TData };
      }
      return { data: {} as TData };
    },
    deleteMany: async <TData extends BaseRecord, TVariables>({
      resource,
      ids,
    }: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
      if (resource === "messages") {
        const messages = selectMessageEntities(store.getState());
        const deletedMessages = ids.map((id) => messages[id]) as unknown[];

        store.dispatch(actions.removeMessages(ids));
        return { data: deletedMessages as TData[] };
      }
      return { data: [] as TData[] };
    },
    getMany: async <TData extends BaseRecord>({
      resource,
      ids,
    }: GetManyParams): Promise<GetListResponse<TData>> => {
      if (resource === "messages") {
        const allMessages = selectMessageEntities(store.getState());
        const messages = ids.map((id) => allMessages[id]) as unknown[];
        return { data: messages as TData[], total: messages.length };
      }
      return { data: [], total: 0 };
    },
    createMany: async <TData extends BaseRecord, TVariables>({
      resource,
      variables,
    }: CreateManyParams<TVariables>): Promise<CreateManyResponse<TData>> => {
      if (resource === "messages") {
        const messages = variables as unknown[];
        store.dispatch(actions.addMessages(messages as Message[]));
        return { data: messages as TData[] };
      }
      return { data: [] as TData[] };
    },
    updateMany: async <TData extends BaseRecord, TVariables>({
      resource,
      ids,
      variables,
    }: UpdateManyParams<TVariables>): Promise<UpdateManyResponse<TData>> => {
      if (resource === "messages") {
        const updateMessages = variables as unknown[];
        const messages = ids.map((id, index) => {
          return { id, changes: updateMessages[index] };
        }) as unknown[];
        store.dispatch(actions.updateMessages(messages as Update<Message>[]));
        return { data: updateMessages as TData[] };
      }
      return { data: [] as TData[] };
    },
    getApiUrl: () => "",
  };
}
