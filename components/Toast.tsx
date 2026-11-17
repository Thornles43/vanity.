"use client";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="gilded-border fixed bottom-28 left-1/2 z-[60] flex max-w-[90vw] animate-toast items-center gap-2 rounded-full bg-cocoa px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-tertiary-fixed shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
    >
      <span className="text-tertiary-container">✦</span>
      <span>{message}</span>
    </div>
  );
}
