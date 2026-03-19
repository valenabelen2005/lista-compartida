import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
            {/* Botón de perfil arriba a la derecha */}
      <div className="w-full max-w-md flex justify-end">
        <button
          onClick={() => navigate("/profile")}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl"
        >
          {user?.displayName ?? "Mi perfil"}
        </button>
      </div>

      <h1 className="text-4xl font-bold mt-10">
        Lista Compartida
      </h1>
      <p className="text-gray-500 mt-2">
        Organiza tus compras en grupo
      </p>
     
      <div className="w-full max-w-md mt-10 flex flex-col gap-4">
        <button
          onClick={() => navigate("/join")}
          className="bg-blue-100 p-4 rounded-xl text-left"
        >
          🔗 Unirse a un grupo
        </button>
        <button
          onClick={() => navigate("/create")}
          className="bg-green-100 p-4 rounded-xl text-left"
        >
          ➕ Crear grupo
        </button>
        <button
          onClick={() => navigate("/groups")}
          className="bg-gray-800 text-white p-4 rounded-xl text-left"
        >
          👥 Ver mis grupos
        </button>

      </div>

    </main>
  );
}