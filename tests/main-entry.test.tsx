import { afterEach, describe, expect, it } from "bun:test";

import { cleanup, render, screen } from "@testing-library/react";

import React, { act } from "react";

import { AppRoot, LoadingBackdrop, renderApp } from "../src/main";

type DeferredComponent = {
  Component: React.ComponentType;
  resolve: () => void;
};

function createDeferredComponent(label: string): DeferredComponent {
  let resolver: (() => void) | undefined;

  const promise = new Promise<{ default: () => React.ReactElement }>((resolve) => {
    resolver = () => resolve({ default: () => <p>{label}</p> });
  });

  return {
    Component: React.lazy(() => promise),
    resolve: () => resolver?.(),
  };
}

describe("main entry Suspense flow", () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("renders the loading backdrop whilst translations hydrate", async () => {
    const { Component, resolve } = createDeferredComponent("App ready");
    render(<AppRoot AppComponent={Component} fallback={<LoadingBackdrop />} />);

    expect(screen.getByRole("status", { name: /loading/i })).toBeTruthy();

    await act(async () => {
      resolve();
    });

    expect(await screen.findByText("App ready")).toBeTruthy();
  });

  it("mounts the SPA via renderApp for imperative hosts", () => {
    const mount = document.createElement("div");
    document.body.append(mount);

    const root = renderApp(mount, {
      AppComponent: () => <p>Mounted</p>,
    });

    expect(mount.textContent).toContain("Mounted");
    root.unmount();
  });

  it("exposes polite semantics on the loading backdrop", () => {
    render(<LoadingBackdrop />);
    const output = screen.getByRole("status");
    expect(output?.getAttribute("aria-live")).toBe("polite");
    expect(output?.textContent).toMatch(/loading/i);
  });
});

/**@example
 * ```ts
 * import { renderApp } from "../src/main";
 *
 * renderApp(document.getElementById("root") as HTMLElement);
 * ```
 */
