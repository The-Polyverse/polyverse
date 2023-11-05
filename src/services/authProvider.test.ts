import { describe, it, expect } from "vitest";
import createAuthProvider from "./authProvider";

const authProvider = createAuthProvider();

describe("authProvider", () => {
  it("returns true for login", async () => {
    const result = await authProvider.login({
      username: "admin",
      password: "admin",
    });

    expect(result.success).toEqual(true);
  });

  it("returns true for getPermissions", async () => {
    const result = await authProvider.getPermissions();

    expect(result).toEqual(true);
  });
});
