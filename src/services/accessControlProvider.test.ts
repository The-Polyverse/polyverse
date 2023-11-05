import { describe, it, expect } from "vitest";
import createAccessControlProvider from "./accessControlProvider";

const accessControlProvider = createAccessControlProvider();

describe("accessControlProvider", () => {
  it("returns true for getList", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "getList",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for getOne", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "getOne",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for create", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "create",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for update", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "update",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for delete", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "delete",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for deleteMany", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "deleteMany",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for getMany", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "getMany",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for createMany", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "createMany",
      params: {},
    });

    expect(result.can).toEqual(true);
  });

  it("returns true for updateMany", async () => {
    const result = await accessControlProvider.can({
      resource: "messages",
      action: "updateMany",
      params: {},
    });

    expect(result.can).toEqual(true);
  });
});
