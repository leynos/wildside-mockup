/** @file Application root wiring shared providers and the initial route shell. */

import { ThemeProvider } from "./providers/theme-provider";
import { AppRoutes } from "./routes/app-routes";

/**
 * Entry point for the Wildside mockup SPA.
 *
 * @example
 * ```tsx
 * import App from "./app/app";
 *
 * export function Bootstrap() {
 *   return <App />;
 * }
 * ```
 */
export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
