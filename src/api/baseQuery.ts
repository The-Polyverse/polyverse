import { BaseQueryFn } from "@reduxjs/toolkit/query";
import PouchDB from "pouchdb";
import Message from "../models/message";

type Doc = {
  _id?: string;
  _rev?: string;
  value?: unknown;
};

function transformMessageToDoc(message: Partial<Message>): Doc {
  return {
    _id: message.id,
    _rev: message.rev,
    ...message,
  };
}

function transformDocToMessage(doc: Doc): Partial<Message> {
  return {
    id: doc._id!,
    rev: doc._rev,
    ...(doc as object),
  };
}

function createBaseQuery(db: PouchDB.Database) {
  // Define the baseQuery
  const baseQuery: BaseQueryFn<
    {
      method: string;
      record?: Message | Partial<Message>;
      records?: Message[] | Partial<Message>[];
      id?: string;
      ids?: string[];
    },
    unknown,
    unknown
  > = async ({ method, record, records, id, ids }) => {
    switch (method) {
      case "get":
        try {
          const doc = await db.get(id!);
          return { data: transformDocToMessage(doc) };
        } catch (error) {
          return { error: (error as Error).message };
        }
      case "getMany":
        try {
          const docs = await db.allDocs({ keys: ids!, include_docs: true });
          return {
            data: docs.rows
              .filter(
                (row) =>
                  ("value" in row &&
                    row.value !== null &&
                    "deleted" in row.value &&
                    !row.value.deleted) ||
                  ("doc" in row && row.doc !== null)
              )
              .map((row) => {
                return "doc" in row && transformDocToMessage(row.doc!);
              }),
          };
        } catch (error) {
          return { error: (error as Error).message };
        }
      case "put":
        try {
          const response = await db.put(transformMessageToDoc(record!));
          return { data: { ...record!, rev: response.rev } };
        } catch (error) {
          return { error: (error as Error).message };
        }
      case "putMany":
        try {
          const responses = await db.bulkDocs(
            records!.map(transformMessageToDoc)
          );
          const withIds = responses.filter(
            (response) => "id" in response
          ) as PouchDB.Core.Response[];
          return {
            data: records!.map((record, index) => ({
              ...record,
              rev: withIds[index].rev,
            })),
          };
        } catch (error) {
          return { error: (error as Error).message };
        }
      case "delete":
        try {
          const doc = await db.get(id!);
          const response = await db.remove(doc);
          return {
            data: transformDocToMessage({ ...doc, _rev: response.rev }),
          };
        } catch (error) {
          return { error: (error as Error).message };
        }
      case "deleteMany":
        try {
          const docs = await db.allDocs({ keys: ids!, include_docs: true });
          const response = await db.bulkDocs(
            docs.rows.map((row) =>
              "doc" in row ? { ...row.doc, _deleted: true } : row
            )
          );

          return {
            data: docs.rows.map(
              (row, index) =>
                "doc" in row &&
                transformDocToMessage({
                  ...row.doc,
                  _rev: response[index].rev,
                })
            ),
          };
        } catch (error) {
          return { error: (error as Error).message };
        }
      default:
        return { error: "Invalid method" };
    }
  };

  return baseQuery;
}

export default createBaseQuery;
