/** @file Radix-compliant button component with DaisyUI styling tokens. */

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type ButtonVariant = "accent" | "ghost" | "circle";
type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the button as its child element, forwarding props (Radix pattern). */
  asChild?: boolean;
  /** Visual treatment applied to the button. */
  variant?: ButtonVariant;
  /** Density of the padding and font size. */
  size?: ButtonSize;
  /** Whether the button is in an active/pressed state (for toggle buttons). */
  active?: boolean;
}

function joinClassNames(...tokens: Array<string | false | null | undefined>): string {
  return tokens.filter(Boolean).join(" ");
}

function resolveVariant(variant: ButtonVariant, active?: boolean): string {
  if (variant === "ghost") {
    return "border border-base-content/20 bg-transparent text-base-content hover:bg-base-200/60";
  }
  if (variant === "circle") {
    return active
      ? "h-10 w-10 rounded-full border border-base-300/60 bg-accent text-base-900"
      : "h-10 w-10 rounded-full border border-base-300/60 bg-base-200/70 text-base-content";
  }
  return "bg-accent text-base-900 hover:bg-accent/90";
}

function resolveSize(size: ButtonSize, variant: ButtonVariant): string {
  if (variant === "circle") {
    return ""; // Circle variant has fixed dimensions
  }
  return size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base";
}

function resolveShape(variant: ButtonVariant): string {
  return variant === "circle" ? "" : "rounded-xl";
}

/**
 * Accessible button with Radix `asChild` support and DaisyUI-aligned tokens.
 *
 * @example
 * ```tsx
 * <Button variant="accent" size="sm">Download</Button>
 * <Button variant="circle" active={isActive} aria-pressed={isActive}>
 *   <Icon token="{icon.action.like}" />
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, className, size = "md", variant = "accent", active, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";
  const classes = joinClassNames(
    "inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 disabled:cursor-not-allowed disabled:opacity-60",
    resolveShape(variant),
    resolveVariant(variant, active),
    resolveSize(size, variant),
    className,
  );

  return <Component ref={ref} className={classes} {...props} />;
});
