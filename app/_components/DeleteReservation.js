"use client";
import { TrashIcon } from "@heroicons/react/24/solid";
// import { deleteReservation } from "../_lib/action";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId, onDelete }) {
  // Note: React "useTransition" hook allows us to mark a state updated as a so-called transition and when state update is marked as a transition that state update will happen without blocking the UI. It means that UI will stay responsive during re-render and also we get an indication that state transition is happening.
  // Note: Also in NextJs We can actually use this hook to mark a server action as a transition too.
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    //Note: A web API to alert the client first.
    if (confirm("Are sure you want to delete this reservation?"))
      startTransition(() => onDelete(bookingId));
  }

  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      {!isPending ? (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeleteReservation;
