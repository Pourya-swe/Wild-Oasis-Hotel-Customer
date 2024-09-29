"use client";
import { useFormStatus } from "react-dom";
function SubmitButton({ children, pendignLable }) {
  // Note: It's part of React and React-DOM - useFromStatus - to tell Next.js that this action in the form is doing an asynchrounous work.
  // Note: It must be used in component that is rendered inside a form
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? pendignLable : children}
    </button>
  );
}

export default SubmitButton;
