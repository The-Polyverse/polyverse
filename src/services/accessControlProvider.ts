import { AccessControlProvider } from "@pankod/refine";
import { CanParams, CanReturnType } from "@pankod/refine/dist/interfaces";

export default function createAccessControlProvider(): AccessControlProvider {
  return {
    can: async ( { resource, action, params }: CanParams): Promise<CanReturnType> => {
      console.log(resource, action, params);
      return { can: true };
    }
  };
}
