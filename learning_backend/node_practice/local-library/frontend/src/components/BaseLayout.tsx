import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { pathRequiresAuthSet, routerPathsMap } from "../routes";

function BaseLayout(props: React.HTMLAttributes<HTMLElement> & { username?: string }) {
  useEffect(() => {
    document.body.classList.add("d-flex", "flex-column", "books-background", "h-full");
  }, []);

  const navCollapsed = sessionStorage.getItem("navbarExpanded") !== "true";
  const expander = (
    <div
      className={"collapse navbar-collapse" + (!navCollapsed ? " show" : "")}
      id="navbar-toggler-target"
    >
      <ul className="navbar-nav me-auto mb-2 mt-2 mb-lg-0 mt-lg-0">
        {Array.from(routerPathsMap.entries(), (nameAndPath) => {
          console.log(nameAndPath[0], pathRequiresAuthSet.has(nameAndPath[0]));
          if (!props.username && pathRequiresAuthSet.has(nameAndPath[0])) {
            return null;
          } else {
            return (
              <li className="nav-item" key={nameAndPath[0]}>
                {/* auto-adds active class and aria-current="page" when current url path matches NavLink path */}
                <NavLink className="nav-link" to={nameAndPath[1].path} end>
                  {nameAndPath[1].title}
                </NavLink>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
  const toggler = (
    <button
      className={"navbar-toggler" + (navCollapsed ? " collapsed" : "")}
      id="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbar-toggler-target"
      aria-controls="#navbar-toggler-target"
      aria-expanded={!navCollapsed}
      aria-label="Toggle navigation"
      onClick={() => {
        // expanding if the height is 0
        // @ts-expect-error: offsetHeight is a valid property
        const open = document.body.querySelector("#navbar-toggler-target")?.offsetHeight === 0;
        sessionStorage.setItem("navbarExpanded", open.toString());
      }}
    >
      <span className="navbar-toggler-icon"></span>
    </button>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-secondary px-4">
        <div className="container-fluid align-items-baseline p-0">
          <div>
            <p className="navbar-brand">Local Library</p>
            {props.username && <p className="navbar-brand-sub">User: {props.username}</p>}
          </div>
          {toggler}
          {expander}
        </div>
      </nav>
      <main className="flex-grow-1">
        <div className="py-3 px-4">
          <Outlet />
        </div>
      </main>
      <footer className="bg-body-secondary px-4 pt-3">
        <small>
          <p>
            {"This is a project by "}
            <a target="_blank" href="https://me.cshock.tech" rel="noopener">
              Conrad Shock
            </a>
            {" for practicing Django development."}
            <br />
            {"Background iconography and images from "}
            <a target="_blank" href="https://icons8.com/" rel="noopener">
              Icons8
            </a>
            {"."}
          </p>
        </small>
      </footer>
    </>
  );
}

export default BaseLayout;
