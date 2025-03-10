
import { Navigate } from "react-router-dom";

// This is a placeholder protected route component
// You can implement actual authentication later if needed
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // For now, we'll just render the children since auth was removed
  return <>{children}</>;
}
