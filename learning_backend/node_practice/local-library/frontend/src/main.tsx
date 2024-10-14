import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseLayout from "./components/BaseLayout";
import { routerPathsMap } from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout />,
    children: Array.from(routerPathsMap.entries(), (nameAndPath) => nameAndPath[1]),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
