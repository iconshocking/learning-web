import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseLayout from "./components/BaseLayout";
import { routerPathsMap } from "./routes";

const router = createBrowserRouter([
  {
    path: "/catalog",
    element: <BaseLayout></BaseLayout>,
    children: Array.from(routerPathsMap.entries(), (nameAndPath) => nameAndPath[1]),
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // do not need to over-refresh data for such a simple app
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// force fetch to throw on non-200 status codes / add any needed middleware
export class FetchError extends Error {
  response: Response;
  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}
const fetchOriginal = window.fetch;
window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetchOriginal(input, init);
  if (!response.ok) {
    throw new FetchError(response);
  }
  return response;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
