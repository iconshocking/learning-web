import { ReactNode } from "react";

export const routerPathsMap = new Map<string, { path: string; element: ReactNode; title?: string }>([
  ["home", { path: "/", element: <p>1</p>, title: "Home" }],
  ["authors", { path: "/authors", element: <p>2</p>, title: "All authors" }],
  ["books", { path: "/books", element: <p>3</p>, title: "All books" }],
  ["all-borrowed", { path: "/all-borrowed", element: <p>4</p>, title: "All borrowed" }],
  ["my-borrowed", { path: "/my-borrowed", element: <p>5</p>, title: "My borrowed" }],
  ["login", { path: "/login", element: <p>6</p>, title: "Sign in" }],
  ["logout", { path: "/logout", element: <p>7</p>, title: "Sign out" }],
]);

export const pathRequiresAuthSet = new Set(["all-borrowed", "my-borrowed", "logout"]);
