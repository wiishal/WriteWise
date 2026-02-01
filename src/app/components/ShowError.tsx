import { Dispatch, SetStateAction } from "react";

export default function ShowError({
  error,
  closeErrorPopUp,
  
}: {
  error: string | null;
  closeErrorPopUp: Dispatch<SetStateAction<string | null>>;
}) {
  
  return (
    <div className="border flex items-center px-4 py-2 gap-2 rounded-sm border-red-700 text-sm font-bold text-red-500 w-fit justify-between">
      <span>{error}</span>
      <button
        className="border px-2 bg-accent rounder-sm cursor-pointer text-accent-foreground rounded-2xl"
        onClick={() => closeErrorPopUp(null)}
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  );
}
