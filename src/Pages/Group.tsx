import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupsContext";
import { useAuth } from "../context/AuthContext";

export default function Groups() {
  const { myGroups, isLoading, leaveGroup, deleteGroup } = useGroups();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-xl mx-auto">
          <p className="text-gray-500">Cargando grupos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-xl mx-auto">

        {/* Header con perfil */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mis grupos</h1>
            <p className="text-sm text-gray-500">{user?.displayName}</p>
          </div>

          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl"
          >
            Cerrar sesión
          </button>
        </div>

        {myGroups.length === 0 ? (
          <p className="text-gray-500">Todavía no tienes grupos creados.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {myGroups.map((group) => {
              const isCreator = group.createdBy === user?.uid;
              return (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
                >
                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="text-left flex-1"
                  >
                    
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <p className="text-xs text-gray-400">
                      {group.members.length} miembro{group.members.length !== 1 ? "s" : ""}
                    </p>
                  </button>

                  {isCreator ? (
                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="bg-red-100 hover:bg-red-200 transition px-3 py-2 rounded-xl text-sm"
                    >
                      Borrar
                    </button>
                  ) : (
                    <button
                      onClick={() => leaveGroup(group.id)}
                      className="bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-xl text-sm"
                    >
                      Salir
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}