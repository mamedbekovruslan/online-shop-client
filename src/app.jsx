import { useRoutes } from "react-router-dom";
import { Admin, Auth, Cart, Home, ManageProduct, Product } from "./pages";

const App = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/auth", element: <Auth /> },
    { path: "/cart", element: <Cart /> },
    { path: "/admin", element: <Admin /> },
    { path: "/manage-product", element: <ManageProduct /> },
    { path: "/product/:id", element: <Product /> },
    { path: "*", element: <div>Ошибка</div> },
  ];

  const element = useRoutes(routes);

  return <div style={{ width: "100%" }}>{element}</div>;
};

export default App;
