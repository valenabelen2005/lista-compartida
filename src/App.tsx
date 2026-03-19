import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./Pages/Home";
import CreateGroup from "./Pages/CreateGroup";
import JoinGroup from "./Pages/JoinGroup";
import Groups from "./Pages/Group";
import GroupDetail from "./Pages/GroupDetail";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateGroup />} />
      <Route path="/join" element={<JoinGroup />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/:id" element={<GroupDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;