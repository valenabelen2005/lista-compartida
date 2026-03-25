import type { AvatarConfig } from "../hooks/useAvatar";
import { AVATAR_EMOJIS, AVATAR_PRESETS } from "./UserAvatar";

interface Props {
  current: AvatarConfig;
  onSelect: (avatar: AvatarConfig) => void;
  onClose: () => void;
}

export default function AvatarSelector({ current, onSelect, onClose }: Props) {
  const isSelected = (cfg: AvatarConfig): boolean => {
    if (!current || !cfg) return false;
    if (current.type === "emoji" && cfg.type === "emoji") return current.value === cfg.value;
    if (current.type === "preset" && cfg.type === "preset") return current.id === cfg.id;
    return false;
  };

  return (
    // Overlay
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
        padding: "0 0 24px",
      }}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "20px 20px 16px 16px",
          padding: "20px",
          width: "100%",
          maxWidth: "360px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Handle */}
        <div style={{ width: "36px", height: "4px", background: "#374151", borderRadius: "2px", margin: "0 auto" }} />

        {/* Presets */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Avatar
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {AVATAR_PRESETS.map((preset) => {
              const cfg: AvatarConfig = { type: "preset", id: preset.id };
              const selected = isSelected(cfg);
              return (
                <button
                  key={preset.id}
                  onClick={() => { onSelect(cfg); onClose(); }}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: preset.bg,
                    border: selected ? "3px solid #f9fafb" : "3px solid transparent",
                    cursor: "pointer",
                    transition: "transform 150ms ease, border-color 150ms ease",
                    transform: selected ? "scale(1.08)" : "scale(1)",
                    outline: "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Emojis */}
        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Emoji
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
            {AVATAR_EMOJIS.map((emoji) => {
              const cfg: AvatarConfig = { type: "emoji", value: emoji };
              const selected = isSelected(cfg);
              return (
                <button
                  key={emoji}
                  onClick={() => { onSelect(cfg); onClose(); }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "10px",
                    background: selected ? "#1e3a5f" : "#1f2937",
                    border: selected ? "2px solid #3b82f6" : "2px solid transparent",
                    fontSize: "22px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 120ms ease, transform 120ms ease",
                    transform: selected ? "scale(1.1)" : "scale(1)",
                    outline: "none",
                  }}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quitar avatar */}
        {current && (
          <button
            onClick={() => { onSelect(null); onClose(); }}
            style={{
              background: "transparent",
              border: "1px solid #1f2937",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "13px",
              color: "#6b7280",
              cursor: "pointer",
              transition: "color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#1f2937"; }}
          >
            Quitar avatar
          </button>
        )}
      </div>
    </div>
  );
}
