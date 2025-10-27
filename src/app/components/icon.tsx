/** @file Renders Tabler icons based on design token references. */

import type { SVGProps } from "react";

import { resolveToken } from "../tokens/resolve-token";
import { iconRegistry, isValidIconName } from "./icon-registry";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "token"> {
  /** Design token reference, e.g. `{icon.navigation.map}`. */
  token: string;
  /** Optional accessible label when the icon conveys standalone meaning. */
  label?: string;
}

const DEFAULT_ICON_SIZE = 24;
const DEFAULT_STROKE_WIDTH = 1.5;

export function Icon({ token, label, className, ...props }: IconProps): JSX.Element | null {
  let resolvedName: string | null = null;

  try {
    const resolved = resolveToken(token);
    if (typeof resolved === "string") {
      resolvedName = resolved;
    } else {
      console.warn(`Icon token "${token}" did not resolve to a string value.`);
      return null;
    }
  } catch (error) {
    console.error(`Unable to resolve icon token "${token}":`, error);
    return null;
  }

  if (!resolvedName || !isValidIconName(resolvedName)) {
    console.warn(
      `Resolved icon name "${resolvedName}" from token "${token}" is not registered in iconRegistry.`,
    );
    return null;
  }

  const IconComponent = iconRegistry[resolvedName];
  const accessibilityProps = label ? { "aria-label": label, role: "img" } : { "aria-hidden": true };

  return (
    <IconComponent
      width={DEFAULT_ICON_SIZE}
      height={DEFAULT_ICON_SIZE}
      strokeWidth={DEFAULT_STROKE_WIDTH}
      className={className}
      {...accessibilityProps}
      {...props}
    />
  );
}
