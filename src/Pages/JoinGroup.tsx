import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";

export default function JoinGroup() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { joinGroup } = useGroups(); // ← toda la lógica vive aquí
  const navigate = useNavigate();
const handleJoin = async () => {
  const cleanedCode = code.trim().toUpperCase();

  if (!cleanedCode) {
    alert("Escribe un código");
    return;
  }

  try {
    setLoading(true);
    const groupId = await joinGroup(cleanedCode);

    if (!groupId) {
      alert("Código inválido");
      return;
    }

    navigate(`/groups/${groupId}`);
  } catch (error) {
    console.error("Error al unirse:", error);
    alert("Hubo un problema al buscar el grupo");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Unirse a grupo</h1>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código del grupo"
          className="border px-4 py-3 rounded-xl w-full mb-4"
        />

        <button
          onClick={handleJoin}
          disabled={loading}
          className="bg-blue-100 px-4 py-3 rounded-xl w-full disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Unirse"}
        </button>
      </div>
    </main>
  );
}