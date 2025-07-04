import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  widthClass?: string;
  title?: string;
  children: ReactNode;
}


export function Drawer({
  open,
  onClose,
  widthClass = "w-96",
  title,
  children,
}: DrawerProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        aria-label="Close drawer overlay"
        className="flex-1 bg-neutral-900/50 dark:bg-neutral-950/80"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`relative h-full ${widthClass} max-w-full bg-white dark:bg-neutral-900 shadow-xl transform transition-transform duration-300`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 p-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-md hover:cursor-pointer p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Drawer; 