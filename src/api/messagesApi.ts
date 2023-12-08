import { createApi } from "@reduxjs/toolkit/query/react";
import createBaseQuery from "./baseQuery";
import PouchDB from "pouchdb";
import memoryAdapter from "pouchdb-adapter-memory";
import Message from "../models/message";

PouchDB.plugin(memoryAdapter);

// Initialize your PouchDB instance
export const db = new PouchDB("messages", { adapter: "memory" });

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: createBaseQuery(db),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], string[]>({
      query: (ids) => ({ method: "getMany", ids }),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Message", id }))
          : [{ type: "Message" }],
    }),
    getMessage: builder.query<Message, string>({
      query: (id) => ({ method: "get", id }),
      providesTags: (result) => [
        { type: "Message", id: result?.id },
      ],
    }),
    createMessage: builder.mutation<Message, Partial<Message>>({
      query: (newMessage) => ({ method: "put", record: newMessage }),
      invalidatesTags: ["Message"],
    }),
    createMessages: builder.mutation<Message[], Partial<Message>[]>({
      query: (newMessages) => ({ method: "putMany", records: newMessages }),
      invalidatesTags: ["Message"],
    }),
    updateMessage: builder.mutation<Message, Partial<Message>>({
      query: (message) => ({ method: "put", id: message.id, record: message }),
      invalidatesTags: (_results, _error, arg) => [
        {
          type: "Message",
          id: arg.id,
        },
      ],
    }),
    updateMessages: builder.mutation<Message[], Partial<Message>[]>({
      query: (changes) => ({ method: "putMany", records: changes }),
      invalidatesTags: ["Message"],
    }),
    deleteMessage: builder.mutation<Message, string>({
      query: (id) => ({ method: "delete", id }),
      invalidatesTags: (_results, _error, arg) => [
        {
          type: "Message",
          id: arg,
        },
      ],
    }),
    deleteMessages: builder.mutation<Message[], string[]>({
      query: (ids) => ({ method: "deleteMany", ids }),
      invalidatesTags: ["Message"],
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
