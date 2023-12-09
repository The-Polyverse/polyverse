import { createApi } from "@reduxjs/toolkit/query/react";
import createBaseQuery from "./baseQuery";
import PouchDB from "pouchdb";
import memoryAdapter from "pouchdb-adapter-memory";
import Message from "../models/message";

PouchDB.plugin(memoryAdapter);

type Resource = Message;

export const api = createApi({
  reducerPath: "api",
  baseQuery: createBaseQuery(),
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMany: builder.query<Resource[], { resource: string, ids: string[] }>({
      query: ({ resource, ids }) => ({ resource, method: "getMany", ids }),
      providesTags: (result, error, arg) => result
        ? [...result.map(({ id }) => ({ type: 'Message', id })), 'Message']
        : ['Message']
    }),
    getOne: builder.query<Resource, { resource: string, id: string }>({
      query: ({ resource, id }) => ({ resource, method: "get", id }),
      providesTags: (result, error, arg) => [{ type: 'Message', id: result.id }]
    }),
    createOne: builder.mutation<Resource, { resource: string, newResource: Partial<Resource> }>({
      query: ({ resource, newResource }) => ({ resource, method: "put", record: newResource }),
      invalidatesTags: ['Message']
    }),
    createMany: builder.mutation<Resource[], Partial<Resource>[]>({
      query: ({ resource, newResource }) => ({ resource, method: "putMany", records: newResource }),
      invalidatesTags: ['Message']
    }),
    updateOne: builder.mutation<Resource, { resource: string, updatedResource: Partial<Resource> }>({
      query: ({ resource, updatedResource }) => ({ resource, method: "put", id: message.id, record: message }),
      invalidatesTags: (results, error, arg) => ({ type: 'Message', id: arg.id })
    }),
    updateMany: builder.mutation<Resource[], { resource: string, changes: Partial<Resource>[]}>({
      query: ({ resource, changes }) => ({ resource, method: "putMany", records: changes }),
      invalidatesTags: ['Message']
    }),
    deleteOne: builder.mutation<Resource, { resource: string, id: string }>({
      query: ({ resource, id }) => ({ resource, method: "delete", id }),
      invalidatesTags: (results, error, arg) => ({ type: 'Message', id: arg.id })
    }),
    deleteMany: builder.mutation<Resource[], { resource: string, ids: string[] }>({
      query: ({ resource, ids }) => ({ resource, method: "deleteMany", ids }),
      invalidatesTags: ['Message']
    }),
  }),
});

export const {
  useGetMessageQuery,
  useGetMessagesQuery,
  useCreateMessageMutation,
  useCreateMessagesMutation,
  useDeleteMessageMutation,
  useDeleteMessagesMutation,
} = api;
