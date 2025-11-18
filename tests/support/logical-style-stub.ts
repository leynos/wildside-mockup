/** @file Provides lightweight logical property styles so Happy DOM can
 *  resolve text-start/text-end alignments and inset-inline utilities
 *  during unit tests.
 */

let installedHandles = 0;

export function installLogicalStyleStub(): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const styleElement = document.createElement("style");
  installedHandles += 1;
  (styleElement.dataset as DOMStringMap & { testid?: string }).testid =
    `logical-style-stub-${installedHandles}`;
  styleElement.textContent = `
[dir="ltr"] .text-start,
[data-direction="ltr"] .text-start,
.text-start:dir(ltr) {
  text-align: left !important;
}

[dir="rtl"] .text-start,
[data-direction="rtl"] .text-start,
.text-start:dir(rtl) {
  text-align: right !important;
}

[dir="ltr"] .text-end,
[data-direction="ltr"] .text-end,
.text-end:dir(ltr) {
  text-align: right !important;
}

[dir="rtl"] .text-end,
[data-direction="rtl"] .text-end,
.text-end:dir(rtl) {
  text-align: left !important;
}

.customize-segment {
  text-align: start;
}

[dir="ltr"] .customize-segment,
[data-direction="ltr"] .customize-segment,
.customize-segment:dir(ltr) {
  text-align: left !important;
}

[dir="rtl"] .customize-segment,
[data-direction="rtl"] .customize-segment,
.customize-segment:dir(rtl) {
  text-align: right !important;
}

.discover-screen__skip {
  position: absolute;
  inset-inline-end: 1.5rem;
  top: 4rem;
}

[dir="ltr"] .discover-screen__skip,
[data-direction="ltr"] .discover-screen__skip,
.discover-screen__skip:dir(ltr) {
  right: 1.5rem;
  left: auto;
}

[dir="rtl"] .discover-screen__skip,
[data-direction="rtl"] .discover-screen__skip,
.discover-screen__skip:dir(rtl) {
  left: 1.5rem;
  right: auto;
}
`;

  document.head.append(styleElement);
  return () => {
    styleElement.remove();
    // Keep the counter bounded so future testids remain compact.
    if (installedHandles > 0) {
      installedHandles -= 1;
    }
  };
}

/**@example
 * ```ts
 * import { installLogicalStyleStub } from "./support/logical-style-stub";
 *
 * const remove = installLogicalStyleStub();
 * // …run assertions…
 * remove();
 * ```
 */
