
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}
