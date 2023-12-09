import listenerMiddleware from "./listenerMiddleware.ts";
import createMessagesSlice from "../features/message/messageSlice.ts";
import { api } from "../api/api.ts";

const messageSlice = createMessagesSlice();
const resource = "messages";

listenerMiddleware.startListening({
  actionCreator: messageSlice.actions.addMessage,
  effect: (action, listenerApi) => {
    const { dispatch } = listenerApi;

    dispatch(api.endpoints.createOne.initiate({ resource, ...action.payload }));
  },
});

listenerMiddleware.startListening({
  actionCreator: messageSlice.actions.updateMessage,
  effect: (action, listenerApi) => {
    const { dispatch } = listenerApi;

    dispatch(
      api.endpoints.updateOne.initiate({
        resource,
        updatedResource: {
          id: `${action.payload.id}`,
          content: action.payload.changes.content,
        }
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: messageSlice.actions.removeMessage,
  effect: (action, listenerApi) => {
    const { dispatch } = listenerApi;

    dispatch(
      api.endpoints.deleteOne.initiate({
        resource, 
        id: `${action.payload}`
      })
    );
  },
});
