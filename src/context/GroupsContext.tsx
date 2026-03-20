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

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

interface GroupsContextType {
  myGroups: GroupType[];
  isLoading: boolean;
  addGroup: (name: string) => Promise<void>;
  joinGroup: (code: string) => Promise<string | null>;
  leaveGroup: (groupId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  addItemToGroup: (groupId: string, itemName: string, quantity: string) => Promise<void>;
  toggleItemPurchased: (groupId: string, itemId: string) => Promise<void>;
  deleteItemFromGroup: (groupId: string, itemId: string) => Promise<void>;
  updateItemQuantity: (groupId: string, itemId: string, quantity: string) => Promise<void>;
  updateItemName: (groupId: string, itemId: string, name: string) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function useGroups(): GroupsContextType {
  const context = useContext(GroupsContext);
  if (!context) throw new Error("useGroups debe usarse dentro de GroupsProvider");
  return context;
}

export function GroupsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allGroups, setAllGroups] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sin localStorage — los grupos del usuario se filtran por su uid en Firestore
  useEffect(() => {
    if (!user) {
      setAllGroups([]);
      setIsLoading(false);
      return;
    }

    // Solo trae grupos donde el usuario es miembro
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

  const myGroups = useMemo(() => allGroups, [allGroups]);

  const addGroup = useCallback(async (name: string) => {
    if (!user) return;
    await addDoc(collection(db, "groups"), {
      name,
      code: generateCode(),
      createdAt: Date.now(),
      createdBy: user.uid,   // ← quién lo creó
      members: [user.uid],   // ← empieza con el creador
      items: [],
    });
  }, [user]);

  const joinGroup = useCallback(async (code: string): Promise<string | null> => {
    if (!user) return null;
    const upperCode = code.trim().toUpperCase();
    try {
      const q = query(collection(db, "groups"), where("code", "==", upperCode));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const groupDoc = snapshot.docs[0];
      // Agrega el uid al array members en Firestore
      await updateDoc(doc(db, "groups", groupDoc.id), {
        members: arrayUnion(user.uid),
      });
      return groupDoc.id;
    } catch (error) {
      console.error("Error en joinGroup:", error);
      return null;
    }
  }, [user]);

  // Salir: quita al usuario del array members
  const leaveGroup = useCallback(async (groupId: string) => {
    if (!user) return;
    const group = allGroups.find((g) => g.id === groupId);
    if (!group) return;
    await updateDoc(doc(db, "groups", groupId), {
      members: group.members.filter((id: string) => id !== user.uid),
    });
  }, [user, allGroups]);

  // Borrar: solo el creador puede hacerlo
  const deleteGroup = useCallback(async (groupId: string) => {
    if (!user) return;
    const group = allGroups.find((g) => g.id === groupId);
    if (!group || group.createdBy !== user.uid) return; // seguridad
    await deleteDoc(doc(db, "groups", groupId));
  }, [user, allGroups]);

const addItemToGroup = useCallback(
  async (groupId: string, itemName: string, quantity: string) => {
    const group = allGroups.find((g) => g.id === groupId);
    if (!group) return;
    const newItem: ShoppingItemType = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: itemName,
      quantity,
      purchased: false,
      addedBy: user?.uid ?? "",
      addedByName: user?.displayName ?? "Alguien",
    };
    await updateDoc(doc(db, "groups", groupId), {
      items: [...group.items, newItem],
    });
  },
  [allGroups, user]
);
  const updateItemName = useCallback(
  async (groupId: string, itemId: string, name: string) => {
    const group = allGroups.find((g) => g.id === groupId);
    if (!group) return;
    await updateDoc(doc(db, "groups", groupId), {
      items: group.items.map((item) =>
        item.id === itemId ? { ...item, name } : item
      ),
    });
  },
  [allGroups]
);

  const toggleItemPurchased = useCallback(
    async (groupId: string, itemId: string) => {
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.map((item) =>
          item.id === itemId ? { ...item, purchased: !item.purchased } : item
        ),
      });
    },
    [allGroups]
  );

  const deleteItemFromGroup = useCallback(
    async (groupId: string, itemId: string) => {
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.filter((item) => item.id !== itemId),
      });
    },
    [allGroups]
  );

  const updateItemQuantity = useCallback(
    async (groupId: string, itemId: string, quantity: string) => {
      const group = allGroups.find((g) => g.id === groupId);
      if (!group) return;
      await updateDoc(doc(db, "groups", groupId), {
        items: group.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });
    },
    [allGroups]
  );

  return (
    <GroupsContext.Provider
      value={{
        myGroups,
        isLoading,
        addGroup,
        joinGroup,
        leaveGroup,
        deleteGroup,
        addItemToGroup,
        toggleItemPurchased,
        deleteItemFromGroup,
        updateItemQuantity,
        updateItemName,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}