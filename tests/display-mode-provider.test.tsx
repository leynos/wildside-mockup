import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { ReactElement } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import { DisplayModeProvider, useDisplayMode } from "../src/app/providers/display-mode-provider";

type MatchMediaMap = Record<string, boolean>;

function createMatchMediaStub(matches: MatchMediaMap) {
  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();

  function notify(query: string, matchesValue: boolean) {
    const event: MediaQueryListEvent = {
      matches: matchesValue,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    } as MediaQueryListEvent;

    const queryListeners = listeners.get(query);
    if (!queryListeners) {
      return;
    }
    for (const listener of queryListeners) {
      listener(event);
    }
  }

  function matchMedia(query: string): MediaQueryList {
    const initialMatches = Boolean(matches[query]);
    const subscriptions = listeners.get(query) ?? new Set();
    listeners.set(query, subscriptions);

    const mediaQueryList: MediaQueryList = {
      media: query,
      matches: initialMatches,
      onchange: null,
      addEventListener: (eventName, listener) => {
        if (eventName !== "change") return;
        subscriptions.add(listener as (event: MediaQueryListEvent) => void);
      },
      removeEventListener: (eventName, listener) => {
        if (eventName !== "change") return;
        subscriptions.delete(listener as (event: MediaQueryListEvent) => void);
      },
      addListener: (listener) => {
        subscriptions.add(listener as (event: MediaQueryListEvent) => void);
      },
      removeListener: (listener) => {
        subscriptions.delete(listener as (event: MediaQueryListEvent) => void);
      },
      dispatchEvent: () => false,
    };

    return mediaQueryList;
  }

  const originalMatchMedia = window.matchMedia;
  window.matchMedia = matchMedia;

  return {
    setMatch(query: string, matchesValue: boolean) {
      matches[query] = matchesValue;
      notify(query, matchesValue);
    },
    restore() {
      if (originalMatchMedia) {
        window.matchMedia = originalMatchMedia;
      } else {
        // @ts-expect-error - deleting to mirror the original undefined state when present.
        delete window.matchMedia;
      }
      listeners.clear();
    },
  };
}

describe("DisplayModeProvider", () => {
  const STORAGE_KEY = "wildside.displayMode";
  let root: Root | null = null;
  let matchMediaStub: ReturnType<typeof createMatchMediaStub> | null = null;

  function cleanup() {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }
    document.body.innerHTML = "";
    window.localStorage.clear();
    matchMediaStub?.restore();
    matchMediaStub = null;
  }

  function mountWithProvider(node: ReactElement) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(<DisplayModeProvider>{node}</DisplayModeProvider>);
    });
    return container;
  }

  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("defaults to full-browser mode on coarse pointer devices", () => {
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": true,
      "(max-width: 768px)": false,
    });

    const Probe = () => {
      const { mode } = useDisplayMode();
      return <span data-mode={mode} />;
    };

    const container = mountWithProvider(<Probe />);
    const indicator = container.querySelector("span[data-mode]");
    expect(indicator?.getAttribute("data-mode")).toBe("full-browser");
  });

  it("defaults to hosted mode on desktop heuristics", () => {
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": false,
      "(max-width: 768px)": false,
    });

    const Probe = () => {
      const { mode } = useDisplayMode();
      return <span data-mode={mode} />;
    };

    const container = mountWithProvider(<Probe />);
    const indicator = container.querySelector("span[data-mode]");
    expect(indicator?.getAttribute("data-mode")).toBe("hosted");
  });

  it("honours a stored user preference", () => {
    window.localStorage.setItem(STORAGE_KEY, "full-browser");
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": false,
      "(max-width: 768px)": false,
    });

    const Probe = () => {
      const { mode } = useDisplayMode();
      return <span data-mode={mode} />;
    };

    const container = mountWithProvider(<Probe />);
    const indicator = container.querySelector("span[data-mode]");
    expect(indicator?.getAttribute("data-mode")).toBe("full-browser");
  });

  it("persists manual toggles", () => {
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": false,
      "(max-width: 768px)": false,
    });

    const Toggle = () => {
      const { setFullBrowser } = useDisplayMode();
      return (
        <button type="button" onClick={() => setFullBrowser()}>
          go-full
        </button>
      );
    };

    const container = mountWithProvider(<Toggle />);
    const button = container.querySelector<HTMLButtonElement>("button");
    expect(button).toBeTruthy();

    act(() => {
      button?.click();
    });

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("full-browser");
  });

  it("resets to system defaults and clears stored preferences", () => {
    window.localStorage.setItem(STORAGE_KEY, "hosted");
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": true,
      "(max-width: 768px)": true,
    });

    const Controls = () => {
      const { mode, resetToSystemDefault, hasUserPreference } = useDisplayMode();
      return (
        <>
          <span data-mode={mode} data-has-user-pref={hasUserPreference ? "yes" : "no"} />
          <button type="button" onClick={() => resetToSystemDefault()}>
            reset
          </button>
        </>
      );
    };

    const container = mountWithProvider(<Controls />);
    const button = container.querySelector<HTMLButtonElement>("button");
    expect(button).toBeTruthy();

    act(() => {
      button?.click();
    });

    const indicator = container.querySelector("span[data-mode]");
    expect(indicator?.getAttribute("data-mode")).toBe("full-browser");
    expect(indicator?.getAttribute("data-has-user-pref")).toBe("no");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
