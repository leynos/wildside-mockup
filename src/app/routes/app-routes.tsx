/** @file Configures TanStack Router with the application route tree. */

import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./route-tree";

export function createAppRouter() {
  return createRouter({ routeTree });
}

export const router = createAppRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export interface AppRoutesProps {
  /**
   * Optional router instance. Tests can supply their own router to control the
   * initial location without mutating the shared singleton.
   */
  routerInstance?: ReturnType<typeof createAppRouter>;
}

export function AppRoutes({ routerInstance = router }: AppRoutesProps = {}): JSX.Element {
  return <RouterProvider router={routerInstance} />;
}
