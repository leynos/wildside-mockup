/** @file Bootstraps the Radix × DaisyUI playground SPA for Bun's HTML entry point. */

import React, { type JSX } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/app";
import "./i18n";
import "./index.css";

function LoadingBackdrop(): JSX.Element {
  return (
    <output
      aria-live="polite"
      className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-base-content/70"
    >
      Loading…
    </output>
  );
}

const mount = document.body?.children.namedItem("root");

if (!(mount instanceof HTMLElement)) {
  throw new Error("Mount point '#root' is required to render the SPA.");
}

createRoot(mount).render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingBackdrop />}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
);
