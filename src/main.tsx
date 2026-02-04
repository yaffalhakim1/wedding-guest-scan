import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";
import App from "./App";
import "./index.css";

import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NuqsAdapter>
        <ChakraProvider value={system}>
          <App />
        </ChakraProvider>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>,
);
