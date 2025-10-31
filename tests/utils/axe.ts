import { configureAxe } from "jest-axe";

export const axe = configureAxe({
  rules: {
    // Radix focus guards intentionally use tabindex="0" elements flagged as aria-hidden,
    // which is safe but trips axe's aria-hidden-focus rule. Disable globally for tests.
    "aria-hidden-focus": { enabled: false },
  },
});
