import { AuthBindings } from "@refinedev/core";
import { AuthActionResponse, CheckResponse, OnErrorResponse } from "@refinedev/core/dist/interfaces";

export default function createAuthProvider(): AuthBindings {
  return {
    login: async ({ username, password }): Promise<AuthActionResponse> => {
      console.log("login", username, password);
      return { success: true };
    },
    check: async (): Promise<CheckResponse> => {
      return { authenticated: true };
    },
    logout: async (): Promise<AuthActionResponse> => {
      return { success: true };
    },
    onError: async (error): Promise<OnErrorResponse> => {
      console.error(error);
      return {};
    },
    getPermissions: async (): Promise<unknown> => {
      return { permissions: ["admin"] };
    },
    getIdentity: async (): Promise<unknown> => {
      return { id: "1", name: "admin", permissions: ["admin"] };
    },
    register: async ({ username, password }): Promise<AuthActionResponse> => {
      console.log("register", username, password);
      return { success: true };
    },
    forgotPassword: async ({ username }): Promise<AuthActionResponse> => {
      console.log("forgotPassword", username);
      return { success: true };
    },
    updatePassword: async ({ username, password, newPassword }): Promise<AuthActionResponse> => {
      console.log("updatePassword", username, password, newPassword);
      return { success: true };
    },
  };
}
