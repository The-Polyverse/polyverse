import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query";
import Message from "../types/message";
import { EntityId } from "@reduxjs/toolkit";

type QueryFn = BaseQueryFn<
{
  resource: string;
  method: string;
  record?: Message | Partial<Message>;
  records?: Message[] | Partial<Message>[];
  id?: EntityId;
  ids?: EntityId[];
},
unknown,
unknown
>;

export default function createCache() {
  const baseQuery: QueryFn = ({ resource, method, record, records, id, ids }) => {
    console.log({ resource, method, record, records, id, ids });
    return {
      data: {},
    };
  };

  const cache = createApi({
    reducerPath: "cache",
    baseQuery,
    tagTypes: ["Entities"],
    endpoints: () => ({

    }),
  });

  return cache;
}
