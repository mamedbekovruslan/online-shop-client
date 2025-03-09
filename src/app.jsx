import { useRoutes, Navigate } from "react-router-dom";
import { Admin, Auth, Cart, Home, ManageProduct, Product } from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Auth /> },
    { path: "/cart", element: <Cart /> },
    { path: "/product/:id", element: <Product /> },

    // Защищённые маршруты (только для админов)
    {
      element: <ProtectedRoute allowedRoles={["admin"]} />,
      children: [
        { path: "/admin", element: <Admin /> },
        { path: "/manage-product", element: <ManageProduct /> },
      ],
    },

    { path: "*", element: <Navigate to="/" replace /> }, // Редирект, если путь не найден
  ];

  const element = useRoutes(routes);

  return <div style={{ width: "100%" }}>{element}</div>;
};

export default App;
