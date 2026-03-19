import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const { addGroup } = useGroups();
  const navigate = useNavigate();
const handleCreateGroup = async () => {
  const trimmedName = groupName.trim();
  
  if (!trimmedName) return;
   try {
    console.log("1. Intentando crear grupo:", trimmedName);
    await addGroup(trimmedName);
    console.log("2. Grupo creado, navegando...");
    setGroupName("");
    navigate("/groups");
  } catch (error) {
    console.error("ERROR al crear grupo:", error);
  }
};

  return (
    <main className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Crear grupo</h1>

        <input
          type="text"
          placeholder="Nombre del grupo"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-gray-500"
        />

        <button
          onClick={handleCreateGroup}
          className="w-full mt-4 bg-green-200 hover:bg-green-300 transition rounded-xl px-4 py-3 font-medium"
        >
          Guardar grupo
        </button>
      </div>
    </main>
  );
}