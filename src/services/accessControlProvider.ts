import { AccessControlProvider, CanParams, CanReturnType } from "@refinedev/core";

export default function createAccessControlProvider(): AccessControlProvider {
  return {
    can: async ( { resource, action, params }: CanParams): Promise<CanReturnType> => {
      console.log(resource, action, params);
      return { can: true };
    }
  };
}
