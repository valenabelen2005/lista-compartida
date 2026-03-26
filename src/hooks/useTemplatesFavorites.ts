import { useState, useCallback } from "react";
import type { TemplateType, TemplateItemType, FavoriteItemType } from "../types";

const TEMPLATES_KEY = "lista-templates-v1";
const FAVORITES_KEY = "lista-favorites-v1";

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useTemplatesFavorites() {
  const [templates, setTemplatesState] = useState<TemplateType[]>(() => load(TEMPLATES_KEY));
  const [favorites, setFavoritesState] = useState<FavoriteItemType[]>(() => load(FAVORITES_KEY));

  const updateTemplates = useCallback((updater: (prev: TemplateType[]) => TemplateType[]) => {
    setTemplatesState((prev) => {
      const next = updater(prev);
      save(TEMPLATES_KEY, next);
      return next;
    });
  }, []);

  const updateFavorites = useCallback((updater: (prev: FavoriteItemType[]) => FavoriteItemType[]) => {
    setFavoritesState((prev) => {
      const next = updater(prev);
      save(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const createTemplate = useCallback((name: string, items: TemplateItemType[]) => {
    const newTemplate: TemplateType = {
      id: `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      items,
      createdAt: Date.now(),
    };
    updateTemplates((prev) => [...prev, newTemplate]);
    return newTemplate;
  }, [updateTemplates]);

  const updateTemplate = useCallback((id: string, changes: Partial<Pick<TemplateType, "name" | "items">>) => {
    updateTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }, [updateTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    updateTemplates((prev) => prev.filter((t) => t.id !== id));
  }, [updateTemplates]);

  const addFavorite = useCallback((item: Omit<FavoriteItemType, "id">) => {
    const newFav: FavoriteItemType = {
      id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...item,
    };
    updateFavorites((prev) => {
      if (prev.some((f) => f.name.toLowerCase() === item.name.toLowerCase())) return prev;
      return [...prev, newFav];
    });
  }, [updateFavorites]);

  const removeFavorite = useCallback((id: string) => {
    updateFavorites((prev) => prev.filter((f) => f.id !== id));
  }, [updateFavorites]);

  return {
    templates,
    favorites,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addFavorite,
    removeFavorite,
  };
}
