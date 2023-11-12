import listenerMiddleware from "./listenerMiddleware.ts";
import createMessagesSlice from "../features/message/messageSlice.ts";
import { messageApi } from "../api/messagesApi.ts";

const messageSlice = createMessagesSlice();

listenerMiddleware.startListening({
  actionCreator: messageSlice.actions.addMessage,
  effect: (action, listenerApi) => {
    const { dispatch } = listenerApi;

    dispatch(messageApi.endpoints.createMessage.initiate(action.payload));
  },
});

listenerMiddleware.startListening({
  actionCreator: messageSlice.actions.updateMessage,
  effect: (action, listenerApi) => {
    const { dispatch } = listenerApi;

    dispatch(
      messageApi.endpoints.updateMessage.initiate({
        id: `${action.payload.id}`,
        content: action.payload.changes.content,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: messageSlice.actions.removeMessage,
  effect: (action, listenerApi) => {
    const { dispatch } = listenerApi;

    dispatch(
       messageApi.endpoints.deleteMessage.initiate(
        `${action.payload}`
      )
    );
  },
});
