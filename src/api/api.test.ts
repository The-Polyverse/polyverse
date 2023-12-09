import { describe, it, beforeEach, expect } from "vitest";

import { createStore } from "../app/store";
import { api } from "./api";

let store: ReturnType<typeof createStore>;
const resource = "messages";

describe("api", () => {
  beforeEach(async () => {
    store = createStore({
      messages: {
        entities: {
          1: { id: "1", content: "Hello" },
          2: { id: "2", content: "World" },
        },
        ids: ["1", "2"],
      },
    });
  });

  describe("fetchMessages", () => {
    it("should fetch messages", async () => {
      const messages = await store
        .dispatch(api.endpoints.getMany.initiate({ resource, ids: ["1", "2"] }))
        .unwrap();
      expect(messages).toEqual([
        expect.objectContaining({
          id: "1",
          content: "Hello",
          rev: expect.any(String),
        }),
        expect.objectContaining({
          id: "2",
          content: "World",
          rev: expect.any(String),
        }),
      ]);
    });
  });

  describe("fetchMessage", () => {
    it("should fetch a message", async () => {
      const message = await store
        .dispatch(api.endpoints.getOne.initiate({ resource, id: "1" }))
        .unwrap();
      expect(message).toEqual(
        expect.objectContaining({
          id: "1",
          content: "Hello",
          rev: expect.any(String),
        })
      );
    });
  });

  describe("createMessage", () => {
    it("should create a message", async () => {
      const message = await store
        .dispatch(
          api.endpoints.createOne.initiate({
            resource,
            newResource: {
              content: "Hello",
            }
          })
        )
        .unwrap();
      expect(message).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          content: "Hello",
          rev: expect.any(String),
        })
      );
    });
  });

  describe("postMessages", () => {
    it("should post messages", async () => {
      const messages = await store
        .dispatch(
          api.endpoints.createMessages.initiate({ 
            resource,
            newResources: [
              { id: "3", content: "Hello" },
              { id: "4", content: "World" },
            ]
          })
        )
        .unwrap();
      expect(messages).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          content: "Hello",
          rev: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          content: "World",
          rev: expect.any(String),
        }),
      ]);
    });
  });

  describe("updateMessage", () => {
    it("should update a message", async () => {
      const message = await store
        .dispatch(
          api.endpoints.updateMessage.initiate({
            resource,
            updatedResource: {
              id: "1",
              content: "Hello",
            }
          })
        )
        .unwrap();

      expect(message).toEqual(
        expect.objectContaining({
          id: "1",
          content: "Hello",
        })
      );
    });
  });

  describe("updateMessages", () => {
    it("should update messages", async () => {
      const messages = await store
        .dispatch(
          api.endpoints.updateMessages.initiate({
            resource,
            updatedResources: [
              { id: "1", content: "Hello" },
              { id: "2", content: "World" },
            ]
          })
        )
        .unwrap();
      expect(messages).toEqual([
        expect.objectContaining({
          id: "1",
          content: "Hello",
        }),
        expect.objectContaining({
          id: "2",
          content: "World",
        }),
      ]);
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message", async () => {
      const message = await store
        .dispatch(api.endpoints.deleteMessage.initiate({ resource, id: "1" }))
        .unwrap();
      expect(message).toEqual(
        expect.objectContaining({
          id: "1",
          content: "Hello",
          rev: expect.any(String),
        })
      );
      const messages = await store
        .dispatch(api.endpoints.getMessages.initiate({ resource, ids: ["1", "2"] }))
        .unwrap();
      expect(messages.length).toBe(1);
    });
  });

  describe("deleteMessages", () => {
    it("should delete messages", async () => {
      const messages = await store
        .dispatch(api.endpoints.deleteMessages.initiate({ resource, ids: ["1", "2"] }))
        .unwrap();
      expect(messages).toEqual([
        expect.objectContaining({
          id: "1",
          content: "Hello",
          rev: expect.any(String),
        }),
        expect.objectContaining({
          id: "2",
          content: "World",
          rev: expect.any(String),
        }),
      ]);
      const allDocs = await db.allDocs({ include_docs: true });
      expect(allDocs.rows.length).toBe(0);
    });
  });
});
