import Button from "../atoms/Button";
import Input from "../atoms/Input";

export default function Form() {
  return (
    <form action="submit-message-url" method="post">
      <Input />
      <Button />
    </form>
  );
}
