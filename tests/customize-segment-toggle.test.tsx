import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { act, type JSX, useState } from "react";
import { createRoot, type Root } from "react-dom/client";

import { CustomizeSegmentToggle } from "../src/app/features/customize/segment-toggle-card";
import { installLogicalStyleStub } from "./support/logical-style-stub";

const applyDocumentDirection = (direction: "ltr" | "rtl") => {
  document.documentElement.dir = direction;
  document.documentElement.setAttribute("data-direction", direction);
  document.body.dir = direction;
  document.body.setAttribute("data-direction", direction);
};

function Harness(): JSX.Element {
  const [value, setValue] = useState("balanced");

  return (
    <ToggleGroup.Root
      value={value}
      onValueChange={(next) => next && setValue(next)}
      type="single"
      aria-label="Crowd level"
    >
      <CustomizeSegmentToggle
        value="balanced"
        label="Balanced"
        description="Mix of busy and quiet streets"
      />
      <CustomizeSegmentToggle
        value="quiet"
        label="Quiet"
        description="Avoids the busiest sections"
      />
    </ToggleGroup.Root>
  );
}

describe("CustomizeSegmentToggle", () => {
  let mountNode: HTMLDivElement | null = null;
  let root: Root | null = null;
  let removeStyles: (() => void) | undefined;

  function mount(): void {
    mountNode = document.createElement("div");
    document.body.appendChild(mountNode);
    root = createRoot(mountNode);
    act(() => {
      root?.render(<Harness />);
    });
  }

  function cleanup(): void {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }
    mountNode?.remove();
    mountNode = null;
    document.body.innerHTML = "";
  }

  beforeAll(() => {
    removeStyles = installLogicalStyleStub();
  });

  afterAll(() => {
    removeStyles?.();
  });

  beforeEach(() => {
    cleanup();
    mount();
  });

  afterEach(() => {
    cleanup();
  });

  it("applies the semantic segment class and updates selection state", () => {
    const toggles = Array.from(
      mountNode?.querySelectorAll<HTMLButtonElement>("button[data-state]") ?? [],
    );

    expect(toggles).toHaveLength(2);
    expect(toggles[0]?.classList.contains("customize-segment")).toBe(true);
    expect(toggles[0]?.getAttribute("data-state")).toBe("on");
    expect(toggles[1]?.getAttribute("data-state")).toBe("off");

    act(() => {
      toggles[1]?.click();
    });

    expect(toggles[0]?.getAttribute("data-state")).toBe("off");
    expect(toggles[1]?.getAttribute("data-state")).toBe("on");
  });

  it("provides accessible labelling via aria attributes", () => {
    const labelledGroup = mountNode?.querySelector<HTMLElement>("[aria-label='Crowd level']");
    expect(labelledGroup).toBeTruthy();

    const pressed = mountNode?.querySelector("button[data-state='on']");
    const pressedState =
      pressed?.getAttribute("aria-pressed") ?? pressed?.getAttribute("aria-checked");
    expect(pressedState).toBe("true");
  });

  it("aligns selection content using logical text-start declarations", () => {
    const readActiveToggle = () =>
      mountNode?.querySelector<HTMLButtonElement>("button[data-state='on']") ?? null;

    let activeToggle = readActiveToggle();
    expect(activeToggle).toBeTruthy();

    applyDocumentDirection("ltr");
    expect(window.getComputedStyle(activeToggle as Element).textAlign).toBe("left");

    cleanup();
    applyDocumentDirection("rtl");
    mount();
    activeToggle = readActiveToggle();
    expect(activeToggle).toBeTruthy();
    expect(window.getComputedStyle(activeToggle as Element).textAlign).toBe("right");

    cleanup();
    applyDocumentDirection("ltr");
    mount();
  });
});
