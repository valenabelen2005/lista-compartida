import type { User } from "firebase/auth";
import type { AvatarConfig } from "../hooks/useAvatar";

export const AVATAR_PRESETS = [
  { id: "blue",   bg: "linear-gradient(135deg, #1e40af, #3b82f6)" },
  { id: "purple", bg: "linear-gradient(135deg, #7c3aed, #a855f7)" },
  { id: "green",  bg: "linear-gradient(135deg, #065f46, #10b981)" },
] as const;

export const AVATAR_EMOJIS = [
  "🦊", "🐼", "🦁", "🐸",
  "🦋", "🌟", "🔥", "⚡",
  "🚀", "🎯", "🌊", "🎮",
];

interface Props {
  user: User | null;
  avatar: AvatarConfig;
  size?: number;
}

export default function UserAvatar({ user, avatar, size = 48 }: Props) {
  const initial = user?.displayName?.[0]?.toUpperCase() ?? "?";
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
    border: "2px solid #1f2937",
  };

  if (avatar?.type === "emoji") {
    return (
      <div style={{ ...base, background: "#1f2937", fontSize: size * 0.48 }}>
        {avatar.value}
      </div>
    );
  }

  if (avatar?.type === "preset") {
    const preset = AVATAR_PRESETS.find((p) => p.id === avatar.id);
    if (preset) {
      return <div style={{ ...base, background: preset.bg }} />;
    }
  }

  // Fallback: inicial del nombre
  return (
    <div
      style={{
        ...base,
        background: "rgba(59,130,246,0.15)",
        fontSize: size * 0.38,
        color: "#3b82f6",
        fontWeight: 700,
      }}
    >
      {initial}
    </div>
  );
}
