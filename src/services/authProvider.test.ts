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

  it("returns true for check", async () => {
    const result = await authProvider.check();

    expect(result.authenticated).toEqual(true);
  });

  it("returns true for logout", async () => {
    const result = await authProvider.logout({ username: "admin" });

    expect(result.success).toEqual(true);
  });

  it("returns true for onError", async () => {
    const result = await authProvider.onError({ error: "error" });

    expect(result).toEqual({});
  });

  it("returns true for getPermissions", async () => {
    const result = authProvider.getPermissions ? await authProvider.getPermissions() : null;

    expect(result).toEqual({ permissions: ["admin"] });
  });

  it("returns true for getIdentity", async () => {
    const result = authProvider.getIdentity ? await authProvider.getIdentity() : null;

    expect(result).toEqual({ id: "1", name: "admin", permissions: ["admin"] });
  });

  it("returns true for register", async () => {
    const result = authProvider.register ? await authProvider.register({ username: "admin", password: "admin" }) : null;

    expect(result && result.success).toEqual(true);
  });

  it("returns true for forgotPassword", async () => {
    const result = authProvider.forgotPassword ? await authProvider.forgotPassword({ username: "admin" }) : null;

    expect(result && result.success).toEqual(true);
  });

  it("returns true for updatePassword", async () => {
    const result = authProvider.updatePassword
      ? await authProvider.updatePassword({ username: "admin", password: "admin", newPassword: "admin" })
      : null;

    expect(result && result.success).toEqual(true);
  });
});
