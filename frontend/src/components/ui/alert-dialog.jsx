import * as React from "react";

export function AlertDialog({ open, onOpenChange, children }) {
  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            {children}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => onOpenChange(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AlertDialogTrigger({ children, onClick }) {
  return React.cloneElement(children, {
    onClick,
  });
}

export function AlertDialogContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}

export function AlertDialogHeader({ children }) {
  return <div className="space-y-1">{children}</div>;
}

export function AlertDialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function AlertDialogDescription({ children }) {
  return <p className="text-gray-600">{children}</p>;
}

export function AlertDialogFooter({ children }) {
  return <div className="flex justify-end gap-3 mt-6">{children}</div>;
}

export function AlertDialogCancel({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
    >
      {children}
    </button>
  );
}
