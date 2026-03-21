import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";
import type { GroupType, ShoppingItemType } from "../types";

const GUEST_GROUPS_KEY = "lista-compartida-guest-groups";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function loadGuestGroups(): GroupType[] {
  try {
    const raw = localStorage.getItem(GUEST_GROUPS_KEY);
    return raw ? (JSON.parse(raw) as GroupType[]) : [];
  } catch {
    return [];
  }
}

function saveGuestGroups(groups: GroupType[]): void {
  localStorage.setItem(GUEST_GROUPS_KEY, JSON.stringify(groups));
}

interface GroupsContextType {
  myGroups: GroupType[];
  isLoading: boolean;
  addGroup: (name: string) => Promise<void>;
  joinGroup: (code: string) => Promise<string | null>;
  leaveGroup: (groupId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  addItemToGroup: (groupId: string, itemName: string, quantity: string, price?: number) => Promise<void>;
  toggleItemPurchased: (groupId: string, itemId: string) => Promise<void>;
  deleteItemFromGroup: (groupId: string, itemId: string) => Promise<void>;
  updateItemQuantity: (groupId: string, itemId: string, quantity: string) => Promise<void>;
  updateItemName: (groupId: string, itemId: string, name: string) => Promise<void>;
  updateItemPrice: (groupId: string, itemId: string, price: number | undefined) => Promise<void>;
  clearPurchasedItems: (groupId: string) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function useGroups(): GroupsContextType {
  const context = useContext(GroupsContext);
  if (!context) throw new Error("useGroups debe usarse dentro de GroupsProvider");
  return context;
}

export function GroupsProvider({ children }: { children: ReactNode }) {
  const { user, isGuest } = useAuth();
  const [allGroups, setAllGroups] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para grupos en modo invitado (persistido en localStorage)
  const [guestGroups, setGuestGroups] = useState<GroupType[]>(loadGuestGroups);

  // Helper para actualizar guestGroups y sincronizar con localStorage
  const updateGuestGroups = useCallback(
    (updater: (prev: GroupType[]) => GroupType[]) => {
      setGuestGroups((prev) => {
        const next = updater(prev);
        saveGuestGroups(next);
        return next;
      });
    },
    []
  );

  // Suscripción a Firebase para usuarios logueados
  useEffect(() => {
    if (!user) {
      setAllGroups([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Migración automática: si había grupos de invitado, los sube a Firestore
    const localGroups = loadGuestGroups();
    if (localGroups.length > 0) {
      Promise.all(
        localGroups.map((g) =>
          addDoc(collection(db, "groups"), {
            name: g.name,
            code: g.code ?? generateCode(),
            createdAt: g.createdAt ?? Date.now(),
            createdBy: user.uid,
            members: [user.uid],
            items: g.items,
          })
        )
      )
        .then(() => {
          localStorage.removeItem(GUEST_GROUPS_KEY);
          setGuestGroups([]);
        })
        .catch(console.error);
    }

    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: GroupType[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            name: d.name ?? "",
            code: d.code ?? "",
            createdAt: d.createdAt ?? 0,
            createdBy: d.createdBy ?? "",
            members: d.members ?? [],
            items: (d.items ?? []) as ShoppingItemType[],
          };
        });
        setAllGroups(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error en onSnapshot:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // myGroups apunta a guest o Firebase según el modo
  const myGroups = useMemo(
    () => (isGuest ? guestGroups : allGroups),
    [isGuest, guestGroups, allGroups]
  );

  // Helper para actualizar items de un grupo invitado
  const updateGuestGroupItems = useCallback(
    (groupId: string, updater: (items: ShoppingItemType[]) => ShoppingItemType[]) => {
      updateGuestGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, items: updater(g.items) } : g))
      );
    },
    [updateGuestGroups]
  );

  const addGroup = useCallback(
    async (name: string) => {
      if (isGuest) {
        const newGroup: GroupType = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name,
          code: generateCode(),
          createdAt: Date.now(),
          createdBy: "guest",
          members: ["guest"],
          items: [],
        };
        updateGuestGroups((prev) => [...prev, newGroup]);
        return;
      }
      if (!user) return;
      await addDoc(collection(db, "groups"), {
        name,
        code: generateCode(),
        createdAt: Date.now(),
        createdBy: user.uid,
        members: [user.uid],
        items: [],
      });
    },
    [user, isGuest, updateGuestGroups]
  );

  const joinGroup = useCallback(
    async (code: string): Promise<string | null> => {
      // En modo invitado no se puede unir a grupos de otros
      if (isGuest) return "GUEST_CANNOT_JOIN";
      if (!user) return null;
      const upperCode = code.trim().toUpperCase();
      try {
        const q = query(collection(db, "groups"), where("code", "==", upperCode));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const groupDoc = snapshot.docs[0];
        await updateDoc(doc(db, "groups", groupDoc.id), {
          members: arrayUnion(user.uid),
        });
        return groupDoc.id;
      } catch (error) {
        console.error("Error en joinGroup:", error);
        return null;
      }
    },
    [user, isGuest]
  );

  const leaveGroup = useCallback(
    async (groupId: string) => {
      if (isGuest) {
        updateGuestGroups((prev) => prev.filter((g) => g.id !== groupId));
        return;
      }
      if (!user) return;
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        members: group.members.filter((id: string) => id !== user.uid),
      });
    },
    [user, isGuest, allGroups, updateGuestGroups]
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      if (isGuest) {
        updateGuestGroups((prev) => prev.filter((g) => g.id !== groupId));
        return;
      }
      if (!user) return;
      const group = allGroups.find((g) => g.id === groupId);
      if (!group || group.createdBy !== user.uid) return;
      await deleteDoc(doc(db, "groups", groupId));
    },
    [user, isGuest, allGroups, updateGuestGroups]
  );

  const addItemToGroup = useCallback(
    async (groupId: string, itemName: string, quantity: string, price?: number) => {
      const groups = isGuest ? guestGroups : allGroups;
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;
      const alreadyExists = group.items.some(
        (item) => item.name.toLowerCase() === itemName.toLowerCase()
      );
      if (alreadyExists) return;

      const newItem: ShoppingItemType = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: itemName,
        quantity,
        ...(price !== undefined && price > 0 ? { price } : {}),
        purchased: false,
        addedBy: user?.uid ?? "guest",
        addedByName: user?.displayName ?? "Vos",
      };

      if (isGuest) {
        updateGuestGroupItems(groupId, (items) => [...items, newItem]);
        return;
      }
      await updateDoc(doc(db, "groups", groupId), {
        items: [...group.items, newItem],
      });
    },
    [allGroups, guestGroups, user, isGuest, updateGuestGroupItems]
  );

  const updateItemName = useCallback(
    async (groupId: string, itemId: string, name: string) => {
      if (isGuest) {
        updateGuestGroupItems(groupId, (items) =>
          items.map((item) => (item.id === itemId ? { ...item, name } : item))
        );
        return;
      }
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.map((item) => (item.id === itemId ? { ...item, name } : item)),
      });
    },
    [allGroups, isGuest, updateGuestGroupItems]
  );

  const toggleItemPurchased = useCallback(
    async (groupId: string, itemId: string) => {
      if (isGuest) {
        updateGuestGroupItems(groupId, (items) =>
          items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  purchased: !item.purchased,
                  purchasedAt: !item.purchased ? Date.now() : undefined,
                }
              : item
          )
        );
        return;
      }
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                purchased: !item.purchased,
                purchasedAt: !item.purchased ? Date.now() : undefined,
              }
            : item
        ),
      });
    },
    [allGroups, isGuest, updateGuestGroupItems]
  );

  const deleteItemFromGroup = useCallback(
    async (groupId: string, itemId: string) => {
      if (isGuest) {
        updateGuestGroupItems(groupId, (items) => items.filter((item) => item.id !== itemId));
        return;
      }
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.filter((item) => item.id !== itemId),
      });
    },
    [allGroups, isGuest, updateGuestGroupItems]
  );

  const updateItemQuantity = useCallback(
    async (groupId: string, itemId: string, quantity: string) => {
      if (isGuest) {
        updateGuestGroupItems(groupId, (items) =>
          items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
        );
        return;
      }
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      });
    },
    [allGroups, isGuest, updateGuestGroupItems]
  );

  const updateItemPrice = useCallback(
    async (groupId: string, itemId: string, price: number | undefined) => {
      if (isGuest) {
        updateGuestGroupItems(groupId, (items) =>
          items.map((item) => (item.id === itemId ? { ...item, price } : item))
        );
        return;
      }
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.map((item) => (item.id === itemId ? { ...item, price } : item)),
      });
    },
    [allGroups, isGuest, updateGuestGroupItems]
  );

  const clearPurchasedItems = useCallback(
    async (groupId: string) => {
      if (isGuest) {
        updateGuestGroupItems(groupId, (items) => items.filter((item) => !item.purchased));
        return;
      }
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.filter((item) => !item.purchased),
      });
    },
    [allGroups, isGuest, updateGuestGroupItems]
  );

  return (
    <GroupsContext.Provider
      value={{
        myGroups,
        isLoading: isGuest ? false : isLoading,
        addGroup,
        joinGroup,
        leaveGroup,
        deleteGroup,
        addItemToGroup,
        toggleItemPurchased,
        deleteItemFromGroup,
        updateItemQuantity,
        updateItemName,
        updateItemPrice,
        clearPurchasedItems,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}
