export default function Input() {
  return (
    <label htmlFor="chat-message">
      Your Message:
      <textarea id="chat-message" name="message" rows={4} required></textarea>
    </label>
  );
}
