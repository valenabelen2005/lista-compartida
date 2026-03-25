import { useNotifications, type Toast } from "../context/NotificationContext";

const CONFIG = {
  item_added: {
    icon: "＋",
    label: "Agregado",
    bg: "#1e3a5f",
    border: "#3b82f6",
    iconBg: "#2563eb",
  },
  item_purchased: {
    icon: "✓",
    label: "Comprado",
    bg: "#14301f",
    border: "#22c55e",
    iconBg: "#16a34a",
  },
  group_joined: {
    icon: "👥",
    label: "Grupo",
    bg: "#2d1b4e",
    border: "#a855f7",
    iconBg: "#7c3aed",
  },
} as const;

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const cfg = CONFIG[toast.type];

  return (
    <div
      onClick={onRemove}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        cursor: "pointer",
        animation: "toast-in 0.25s ease",
        maxWidth: "320px",
        width: "max-content",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: cfg.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>
      <div>
        <div style={{ fontSize: "11px", color: cfg.border, fontWeight: 600, marginBottom: "1px" }}>
          {cfg.label}
        </div>
        <div style={{ fontSize: "13px", color: "#e5e7eb", fontWeight: 500 }}>
          {toast.message}
        </div>
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </>
  );
}
