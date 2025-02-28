import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import "./index.css";
import { theme } from "./styles/theme";
import { Layout } from "./components/layout/layout";
import { Provider } from "react-redux";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Layout>
          <Provider store={store}>
            <App />
          </Provider>
        </Layout>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>
);
