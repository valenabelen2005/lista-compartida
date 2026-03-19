import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, updateDisplayName, logout } = useAuth();
  const [name, setName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    await updateDisplayName(trimmed);
    setSaving(false);
    navigate("/groups");
  };

  return (
    <main className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

        <div className="flex items-center gap-4 mb-6">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="foto"
              className="w-14 h-14 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-xl px-4 py-3 w-full mb-4"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-100 hover:bg-green-200 rounded-xl px-4 py-3 font-medium disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar nombre"}
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}