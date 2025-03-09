import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/auth" replace />; // Перенаправляем неавторизованных
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Если нет прав, уводим на главную
  }

  return <Outlet />;
};
