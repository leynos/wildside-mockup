/** @file Bootstraps the Radix × DaisyUI playground SPA for Bun's HTML entry point. */

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app/app";
import "./index.css";

const mount = document.body?.children.namedItem("root");

if (!(mount instanceof HTMLElement)) {
  throw new Error("Mount point '#root' is required to render the SPA.");
}

createRoot(mount).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
