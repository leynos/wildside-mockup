import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { within } from "@testing-library/dom";
import { act, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";

import { DisplayModeProvider, useDisplayMode } from "../src/app/providers/display-mode-provider";

type MatchMediaMap = Record<string, boolean>;

function createMatchMediaStub(matches: MatchMediaMap) {
  type MediaQueryListener = (event: MediaQueryListEvent) => void;

  const listeners = new Map<string, Set<MediaQueryListener>>();
  const instances = new Map<
    string,
    Set<{ list: MediaQueryList; update(value: boolean, event: MediaQueryListEvent): void }>
  >();
  const listenerMap = new WeakMap<EventListenerOrEventListenerObject, MediaQueryListener>();
  const legacyListenerMap = new WeakMap<
    (this: MediaQueryList, ev: MediaQueryListEvent) => unknown,
    MediaQueryListener
  >();

  const toEventListener = (listener: EventListenerOrEventListenerObject): MediaQueryListener => {
    const existing = listenerMap.get(listener);
    if (existing) {
      return existing;
    }
    const wrapped: MediaQueryListener =
      typeof listener === "function"
        ? (event) => (listener as EventListener)(event)
        : (event) => listener.handleEvent?.(event);
    listenerMap.set(listener, wrapped);
    return wrapped;
  };

  const toLegacyListener = (
    listener: (this: MediaQueryList, ev: MediaQueryListEvent) => unknown,
    owner: MediaQueryList,
  ): MediaQueryListener => {
    const existing = legacyListenerMap.get(listener);
    if (existing) {
      return existing;
    }
    const wrapped: MediaQueryListener = (event) => listener.call(owner, event);
    legacyListenerMap.set(listener, wrapped);
    return wrapped;
  };

  function notify(query: string, matchesValue: boolean) {
    const event = Object.assign(new Event("change"), {
      matches: matchesValue,
      media: query,
    }) as MediaQueryListEvent;

    const queryInstances = instances.get(query);
    if (queryInstances) {
      for (const instance of queryInstances) {
        instance.update(matchesValue, event);
      }
    }

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
    const subscriptions = listeners.get(query) ?? new Set<MediaQueryListener>();
    listeners.set(query, subscriptions);

    let currentMatches = initialMatches;
    let changeHandler: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null = null;

    const mediaQueryList = {
      media: query,
      get matches() {
        return currentMatches;
      },
      get onchange() {
        return changeHandler;
      },
      set onchange(handler) {
        changeHandler = handler;
      },
      addEventListener: (
        type: keyof MediaQueryListEventMap,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (type !== "change" || listener == null) return;
        const wrapped = toEventListener(listener);
        subscriptions.add(wrapped);
      },
      removeEventListener: (
        type: keyof MediaQueryListEventMap,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (type !== "change" || listener == null) return;
        const wrapped = listenerMap.get(listener);
        if (wrapped) {
          subscriptions.delete(wrapped);
        }
      },
      addListener: (listener) => {
        if (!listener) return;
        const wrapped = toLegacyListener(listener, mediaQueryList);
        subscriptions.add(wrapped);
      },
      removeListener: (listener) => {
        if (!listener) return;
        const wrapped = legacyListenerMap.get(listener);
        if (wrapped) {
          subscriptions.delete(wrapped);
        }
      },
      dispatchEvent: () => false,
    } as MediaQueryList;

    const registeredInstances =
      instances.get(query) ??
      new Set<{ list: MediaQueryList; update(value: boolean, event: MediaQueryListEvent): void }>();

    registeredInstances.add({
      list: mediaQueryList,
      update(value, event) {
        currentMatches = value;
        changeHandler?.call(mediaQueryList, event);
      },
    });
    instances.set(query, registeredInstances);

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
      instances.clear();
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

  it("defaults to full-browser mode on narrow viewports", () => {
    matchMediaStub = createMatchMediaStub({
      "(max-width: 768px)": true,
    });

    const Probe = () => {
      const { mode } = useDisplayMode();
      return <output aria-label="Display mode">{mode}</output>;
    };

    const container = mountWithProvider(<Probe />);
    const indicator = within(container).getByRole("status", { name: /display mode/i });
    expect(indicator.textContent).toBe("full-browser");
  });

  it("defaults to hosted mode on desktop heuristics", () => {
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": false,
      "(max-width: 768px)": false,
    });

    const Probe = () => {
      const { mode } = useDisplayMode();
      return <output aria-label="Display mode">{mode}</output>;
    };

    const container = mountWithProvider(<Probe />);
    const indicator = within(container).getByRole("status", { name: /display mode/i });
    expect(indicator.textContent).toBe("hosted");
  });

  it("honours a stored user preference", () => {
    window.localStorage.setItem(STORAGE_KEY, "full-browser");
    matchMediaStub = createMatchMediaStub({
      "(pointer: coarse)": false,
      "(max-width: 768px)": false,
    });

    const Probe = () => {
      const { mode } = useDisplayMode();
      return <output aria-label="Display mode">{mode}</output>;
    };

    const container = mountWithProvider(<Probe />);
    const indicator = within(container).getByRole("status", { name: /display mode/i });
    expect(indicator.textContent).toBe("full-browser");
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
    const ui = within(container);
    const button = ui.getByRole("button", { name: /go-full/i });

    act(() => {
      button.click();
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
          <output aria-label="Display mode">{mode}</output>
          <output aria-label="User preference">{hasUserPreference ? "yes" : "no"}</output>
          <button type="button" onClick={() => resetToSystemDefault()}>
            reset
          </button>
        </>
      );
    };

    const container = mountWithProvider(<Controls />);
    const ui = within(container);
    const button = ui.getByRole("button", { name: /reset/i });

    act(() => {
      button.click();
    });

    const modeStatus = ui.getByRole("status", { name: /display mode/i });
    expect(modeStatus.textContent).toBe("full-browser");
    const preferenceStatus = ui.getByRole("status", { name: /user preference/i });
    expect(preferenceStatus.textContent).toBe("no");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
