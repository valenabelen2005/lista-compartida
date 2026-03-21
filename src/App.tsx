import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./Pages/LoginPage";

// Lazy loading: cada ruta carga su chunk solo cuando se necesita
// → bundle inicial más pequeño → primera carga más rápida en Android
const Home = lazy(() => import("./Pages/Home"));
const CreateGroup = lazy(() => import("./Pages/CreateGroup"));
const JoinGroup = lazy(() => import("./Pages/JoinGroup"));
const Groups = lazy(() => import("./Pages/Group"));
const GroupDetail = lazy(() => import("./Pages/GroupDetail"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));

// Spinner mínimo para Suspense
const PageLoader = () => (
  <main style={{ minHeight: "100vh", background: "#0b0f19", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #1f2937", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </main>
);

function App() {
  const { user, isGuest, isAuthLoading } = useAuth();

  if (isAuthLoading) return <PageLoader />;
  if (!user && !isGuest) return <LoginPage />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create" element={<CreateGroup />} />
        <Route path="/join" element={<JoinGroup />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;