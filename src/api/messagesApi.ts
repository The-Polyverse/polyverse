import { createApi } from "@reduxjs/toolkit/query/react";
import createBaseQuery from "./baseQuery";
import PouchDB from "pouchdb";
import memoryAdapter from "pouchdb-adapter-memory";
import Message from "../models/message";


PouchDB.plugin(memoryAdapter);

// Initialize your PouchDB instance
export const db = new PouchDB("messages", { adapter: "memory" });

// Create the baseQuery
const baseQuery = createBaseQuery(db);

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery,
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], string[]>({
      query: (ids) => ({ method: "getMany", ids }),
    }),
    getMessage: builder.query<Message, string>({
      query: (id) => ({ method: "get", id }),
    }),
    createMessage: builder.mutation<Message, Partial<Message>>({
      query: (newMessage) => ({ method: "put", record: newMessage, id: newMessage.id }),
    }),
    createMessages: builder.mutation<Message[], Partial<Message>[]>({
      query: (newMessages) => ({ method: "putMany", records: newMessages }),
    }),
    updateMessage: builder.mutation<Message, Partial<Message>>({
      query: (message) => ({ method: "put", id: message.id, record: message }),
    }),
    updateMessages: builder.mutation<Message[], Partial<Message>[]>({
      query: (changes) => ({ method: "putMany", records: changes }),
    }),
    deleteMessage: builder.mutation<Message, string>({
      query: (id) => ({ method: "delete", id }),
    }),
    deleteMessages: builder.mutation<Message[], string[]>({
      query: (ids) => ({ method: "deleteMany", ids }),
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
} = messageApi;
