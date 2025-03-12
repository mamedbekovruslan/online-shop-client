import { useRoutes, Navigate } from "react-router-dom";
import { Admin, Auth, Cart, Home, ManageProduct, Product } from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OrderHistory } from "./pages/orders/order-history";
import { AllOrders } from "./pages/all-orders/all-orders";

const App = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Auth /> },
    { path: "/cart", element: <Cart /> },
    { path: "/product/:id", element: <Product /> },
    { path: "/orders", element: <OrderHistory /> },
    {
      element: <ProtectedRoute allowedRoles={["admin"]} />,
      children: [
        { path: "/admin", element: <Admin /> },
        { path: "/manage-product", element: <ManageProduct /> },
        { path: "/all-orders", element: <AllOrders /> },
      ],
    },

    { path: "*", element: <Navigate to="/" replace /> },
  ];

  const element = useRoutes(routes);

  return <div style={{ width: "100%" }}>{element}</div>;
};

export default App;
