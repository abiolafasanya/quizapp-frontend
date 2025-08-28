import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("auth-storage");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}
