import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type NotifType = "item_added" | "item_purchased" | "group_joined";

export interface Toast {
  id: string;
  type: NotifType;
  message: string;
}

interface NotificationContextType {
  toasts: Toast[];
  showNotification: (type: NotifType, message: string) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  return ctx;
}

const TOAST_DURATION = 3500;
const MAX_TOASTS = 3;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotifType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev.slice(-(MAX_TOASTS - 1)), { id, type, message }]);
      setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast]
  );

  return (
    <NotificationContext.Provider value={{ toasts, showNotification, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
}
