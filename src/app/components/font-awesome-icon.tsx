/** @file Utility wrapper for rendering Font Awesome icons consistently. */

export interface FontAwesomeIconProps {
  /** Icon name such as `fa-solid fa-route`. */
  name: string;
  /** Optional utility classes layered on top of the base icon name. */
  className?: string;
  /** Accessible label when the icon conveys standalone meaning. */
  label?: string;
}

function joinClassNames(...tokens: Array<string | undefined>): string {
  return tokens.filter(Boolean).join(" ");
}

/**
 * Render a Font Awesome icon with sensible accessibility defaults.
 *
 * @example
 * ```tsx
 * <FontAwesomeIcon name="fa-solid fa-star" className="text-amber-400" />
 * ```
 */
export function FontAwesomeIcon({ className, label, name }: FontAwesomeIconProps): JSX.Element {
  return (
    <i
      className={joinClassNames(name, className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  );
}
