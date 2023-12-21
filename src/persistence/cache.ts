import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query";
import type { EntityId } from "@reduxjs/toolkit";
import type { Entity } from "../types";

type QueryFn = BaseQueryFn<
  {
    resource: string;
    method: string;
    record?: Entity | Partial<Entity>;
    records?: Entity[] | Partial<Entity>[];
    id?: EntityId;
    ids?: EntityId[];
  },
  unknown,
  unknown
>;

export default function createCache() {
  const baseQuery: QueryFn = ({
    resource,
    method,
    record,
    records,
    id,
    ids,
  }) => {
    console.log({ resource, method, record, records, id, ids });
    return {
      data: {},
    };
  };

  const cache = createApi({
    reducerPath: "cache",
    baseQuery,
    tagTypes: ["Entities"],
    endpoints: () => ({}),
  });

  return cache;
}
