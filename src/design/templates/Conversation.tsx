import { ComponentType } from "react";

export default function Conversation({
  Feed,
  Form,
}: {
  Feed: ComponentType;
  Form: ComponentType;
}) {
  return (
    <main>
      <section>
        <Feed />
      </section>

      <Form />
    </main>
  );
}
