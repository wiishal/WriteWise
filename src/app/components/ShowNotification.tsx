import { Dispatch, SetStateAction } from "react";

export default function ShowNotification({
  message,
  closeNotificationPopUp,
}: {
  message: string;
  closeNotificationPopUp: Dispatch<SetStateAction<string | null>>;
}) {
    return (
    <div className="border flex items-center px-4 py-2 gap-2 rounded-sm border-green-600 text-sm font-bold text-white w-fit justify-between">
      <span>{message}</span>
      <button
        className="border px-2 bg-accent rounder-sm cursor-pointer text-accent-foreground rounded-2xl"
        onClick={() => closeNotificationPopUp(null)}
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  );
}
