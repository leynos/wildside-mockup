/** @file Shared container for wizard step sections. */

import type { ComponentPropsWithoutRef, ElementType, JSX, ReactNode } from "react";

type WizardSectionElement = ElementType;

type BaseWizardSectionProps<T extends WizardSectionElement> = {
  /** Element type to render, defaults to `section`. */
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export type WizardSectionProps<T extends WizardSectionElement = "section"> =
  BaseWizardSectionProps<T>;

export function WizardSection<T extends WizardSectionElement = "section">(
  props: WizardSectionProps<T>,
): JSX.Element {
  const { as, children, className, ...rest } = props;
  const Component = (as ?? "section") as WizardSectionElement;
  const combinedClassName = ["wizard-section", className].filter(Boolean).join(" ");
  return (
    <Component className={combinedClassName} {...rest}>
      {children}
    </Component>
  );
}
