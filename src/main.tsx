import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import React, { Suspense } from "react";
import "./index.css";

const App = React.lazy(() => import("./App.tsx"));

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </ThemeProvider>
);
