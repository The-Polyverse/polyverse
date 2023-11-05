import { Store } from '@reduxjs/toolkit';
import Message from '../models/message';
import createMessagesSlice, { selectAllMessages, selectMessageById, selectMessageIds } from '../features/message/messageSlice';
import { DataProvider, GetListResponse, CreateResponse, UpdateResponse, GetOneResponse } from '@pankod/refine';
import { BaseRecord, DeleteManyResponse, DeleteOneResponse } from '@pankod/refine/dist/interfaces';

export default function createDataProvider(store: Store): DataProvider {
  const { actions } = createMessagesSlice();

  return {
    getList: async <TData extends BaseRecord>({ resource }: { resource?: string }): Promise<GetListResponse<TData>> => {
      if (resource === 'messages') {
        const state = store.getState();
        const messages = selectAllMessages(state) as unknown[];
        return { data: messages as TData[], total: messages.length };
      }
      return { data: [], total: 0 };
    },
    getOne: async <TData extends BaseRecord>({ resource, id }: { resource: string, id: string}): Promise<GetOneResponse<TData>> => {
      if (resource === 'messages') {
        const state = store.getState();
        const message = selectMessageById(state, id) as unknown;
        return { data: message as TData };
      }
      return { data: {} as TData };
    },
    create: async <TData extends BaseRecord>({ resource, variables }: { resource: string, variables: unknown }): Promise<CreateResponse<TData>> => {
      if (resource === 'messages') {
        store.dispatch(actions.addMessage(variables as Message));
        const id = selectMessageIds(store.getState()) as unknown;
        return { data: { id, ...variables as object} as TData };
      }
      return { data: {} as TData };
    },
    update: async <TData extends BaseRecord>({ resource, id, variables }: { resource: string, id: string, variables: unknown }): Promise<UpdateResponse<TData>> => {
      if (resource === 'messages') {
        store.dispatch(actions.updateMessage({ id, changes: variables as Message }));
        return { data: { id, ...variables as object} as TData };
      }
      return { data: {} as TData };
    },
    deleteOne: async <TData extends BaseRecord>({ resource, id }: { resource: string, id: string }): Promise<DeleteOneResponse<TData>> => {
      if (resource === 'messages') {
        const message = selectMessageById(store.getState(), id) as unknown;
        store.dispatch(actions.removeMessage(id));
        return { data: message as TData };
      }
      return { data: {} as TData };
    },
    deleteMany: async <TData extends BaseRecord>(): Promise<DeleteManyResponse<TData>> => { return null as unknown as DeleteManyResponse<TData>; },
    getMany: async <TData extends BaseRecord>(): Promise<GetListResponse<TData>> => { return null as unknown as GetListResponse<TData>; },
    createMany: async <TData extends BaseRecord>(): Promise<CreateResponse<TData>> => { return null as unknown as CreateResponse<TData>; },
    updateMany: async <TData extends BaseRecord>(): Promise<UpdateResponse<TData>> => { return null as unknown as UpdateResponse<TData>; },
    getApiUrl: () => '',
  };
}
