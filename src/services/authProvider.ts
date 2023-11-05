import { AuthProvider } from "@pankod/refine";

export default function createAuthProvider(): AuthProvider {
  return {
    login: async ({ username, password }) => {
      if (username === "admin" && password === "admin") {
        return Promise.resolve({ success: true });
      }

      return Promise.reject();
    },
    logout: async () => {
      return Promise.resolve();
    },
    checkError: async () => {
      return Promise.resolve();
    },
    checkAuth: async () => {
      return Promise.resolve();
    },
    getPermissions: async () => {
      return Promise.resolve(true);
    },
  };
}
