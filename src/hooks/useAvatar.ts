import { useState, useCallback } from "react";

export type AvatarConfig =
  | { type: "emoji"; value: string }
  | { type: "preset"; id: string }
  | null;

function storageKey(uid: string) {
  return `user-avatar-${uid}`;
}

export function loadAvatar(uid: string): AvatarConfig {
  try {
    return JSON.parse(localStorage.getItem(storageKey(uid)) ?? "null");
  } catch {
    return null;
  }
}

function saveAvatar(uid: string, config: AvatarConfig) {
  if (config) {
    localStorage.setItem(storageKey(uid), JSON.stringify(config));
  } else {
    localStorage.removeItem(storageKey(uid));
  }
}

export function useAvatar(uid: string | undefined) {
  const [avatar, setAvatarState] = useState<AvatarConfig>(() =>
    uid ? loadAvatar(uid) : null
  );

  const setAvatar = useCallback(
    (config: AvatarConfig) => {
      if (!uid) return;
      saveAvatar(uid, config);
      setAvatarState(config);
    },
    [uid]
  );

  return { avatar, setAvatar };
}
