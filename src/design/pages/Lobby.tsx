import Feed from "../molecules/Feed";
import Form from "../molecules/Form";
import Conversation from "../templates/Conversation";

export default function Lobby() {
  return (
    <Conversation Feed={Feed} Form={Form} />
  );
}
