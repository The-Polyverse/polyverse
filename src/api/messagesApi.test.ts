import { describe, it, beforeEach, expect } from "vitest";

import { createStore } from "../app/store";
import { messageApi, db } from "./messagesApi";

let store: ReturnType<typeof createStore>;

describe("messagesApi", () => {
  beforeEach(async () => {
    store = createStore({
      messages: {
        entities: {
          1: { id: '1', content: "Hello" },
          2: { id: '2', content: "World" },
        },
        ids: ['1', '2'],
      },
    });

    const allDocs = await db.allDocs({ include_docs: true });
    await db.bulkDocs(allDocs.rows.map((row) => ('doc' in row && { ...row.doc, _deleted: true })));

    db.bulkDocs([
      { _id: "1", content: "Hello" },
      { _id: "2", content: "World" },
    ]);
  });

  describe("fetchMessages", () => {
    it("should fetch messages", async () => {
      const messages = await store.dispatch(messageApi.endpoints.getMessages.initiate(['1', '2'])).unwrap();
      expect(messages).toEqual([
        expect.objectContaining({ id: '1', content: "Hello", rev: expect.any(String) }),
        expect.objectContaining({ id: '2', content: "World", rev: expect.any(String) }),
      ]);
    });
  });

  describe("fetchMessage", () => {
    it("should fetch a message", async () => {
      const message = await store.dispatch(messageApi.endpoints.getMessage.initiate('1')).unwrap();
      expect(message).toEqual(expect.objectContaining({ id: '1', content: "Hello", rev: expect.any(String) }));
    });
  });

  describe("postMessage", () => {
    it("should post a message", async () => {
      const message = await store.dispatch(messageApi.endpoints.createMessage.initiate({ id: '3', content: "Hello" })).unwrap();
      expect(message).toEqual(expect.objectContaining({ id: expect.any(String), content: "Hello", rev: expect.any(String) }));
    });
  });

  describe("postMessages", () => {
    it("should post messages", async () => {
      const messages = await store.dispatch(messageApi.endpoints.createMessages.initiate([
        { id: '3', content: "Hello" },
        { id: '4', content: "World" },
      ])).unwrap();
      expect(messages).toEqual([
        expect.objectContaining({ id: expect.any(String), content: "Hello", rev: expect.any(String) }),
        expect.objectContaining({ id: expect.any(String), content: "World", rev: expect.any(String) }),
      ]);
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message", async () => {
      const message = await store.dispatch(messageApi.endpoints.deleteMessage.initiate('1')).unwrap();
      expect(message).toEqual(expect.objectContaining({ id: '1', content: "Hello", rev: expect.any(String) }));
      const messages = await store.dispatch(messageApi.endpoints.getMessages.initiate(['1', '2'])).unwrap();
      expect(messages.length).toBe(1);
    });
  });

  describe("deleteMessages", () => {
    it("should delete messages", async () => {
      const messages = await store.dispatch(messageApi.endpoints.deleteMessages.initiate(['1', '2'])).unwrap();
      expect(messages).toEqual([
        expect.objectContaining({ id: '1', content: "Hello", rev: expect.any(String) }),
        expect.objectContaining({ id: '2', content: "World", rev: expect.any(String) }),
      ]);
      const allDocs = await db.allDocs({ include_docs: true });
      expect(allDocs.rows.length).toBe(0);
    });
  });

  // describe("postMessage", () => {
  //   it("should post a message", async () => {
  //     const result = await store.dispatch(
  //       messageApi.endpoints.postMessage({ message: "Hello" })
  //     );
  //     expect(result.data).toEqual({ id: 3, message: "Hello" });
  //   });
  // });

  // describe("deleteMessage", () => {
  //   it("should delete a message", async () => {
  //     const result = await store.dispatch(
  //       messageApi.endpoints.deleteMessage({ id: 1 })
  //     );
  //     expect(result.data).toEqual({ id: 1, message: "Hello" });
  //   });
  // });
});
