import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Provider } from "react-redux";
import { store } from "~/redux/store";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Provider store={store}>
        <Outlet />
      </Provider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
