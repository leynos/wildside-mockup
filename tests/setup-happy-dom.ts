import { Window } from "happy-dom";

const happyWindow = new Window();

Object.assign(globalThis, {
  window: happyWindow,
  document: happyWindow.document,
  navigator: happyWindow.navigator,
  HTMLElement: happyWindow.HTMLElement,
  HTMLInputElement:
    (happyWindow as unknown as { HTMLInputElement?: typeof HTMLInputElement }).HTMLInputElement ??
    happyWindow.HTMLElement,
  CustomEvent: happyWindow.CustomEvent,
  Event: happyWindow.Event,
  Node: happyWindow.Node,
  Text: happyWindow.Text,
  MutationObserver: happyWindow.MutationObserver,
  DocumentFragment: happyWindow.DocumentFragment,
  ResizeObserver: (happyWindow as unknown as { ResizeObserver?: typeof ResizeObserver })
    .ResizeObserver,
  requestAnimationFrame: happyWindow.requestAnimationFrame.bind(happyWindow),
  cancelAnimationFrame: happyWindow.cancelAnimationFrame.bind(happyWindow),
  getComputedStyle: happyWindow.getComputedStyle.bind(happyWindow),
  localStorage: happyWindow.localStorage,
  sessionStorage: happyWindow.sessionStorage,
  location: happyWindow.location,
  history: happyWindow.history,
  customElements: happyWindow.customElements,
});

Object.defineProperty(globalThis, "self", {
  value: globalThis.window,
  writable: false,
  configurable: true,
});

(globalThis as Record<string, unknown>).NodeFilter = (
  happyWindow as unknown as { NodeFilter?: typeof NodeFilter }
).NodeFilter ?? {
  SHOW_ELEMENT: 1,
  FILTER_ACCEPT: 1,
  FILTER_REJECT: 2,
  FILTER_SKIP: 3,
};

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

if (!globalThis.ResizeObserver) {
  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
