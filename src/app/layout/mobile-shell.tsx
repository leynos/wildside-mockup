/** @file Mobile device frame used to present the Wildside mockup screens. */

import type { ReactNode } from "react";

export interface MobileShellProps {
  /** Main content rendered inside the framed device shell. */
  children: ReactNode;
  /** Optional background node (for gradients or imagery). */
  background?: ReactNode;
  /** Additional Tailwind classes appended to the frame. */
  className?: string;
  /** Adjusts subtle styling nuances depending on theme tone. */
  tone?: "dark" | "light";
}

function joinClassNames(...tokens: Array<string | false | null | undefined>): string {
  return tokens.filter(Boolean).join(" ");
}

/**
 * Constrains content to a 390×844px viewport with rounded corners and drop shadow.
 *
 * @example
 * ```tsx
 * <MobileShell>
 *   <main className="flex flex-1 items-center justify-center">
 *     <p className="text-base-content/80">Coming soon</p>
 *   </main>
 * </MobileShell>
 * ```
 */
export function MobileShell({
  background,
  children,
  className,
  tone = "dark",
}: MobileShellProps): JSX.Element {
  const frameClasses = joinClassNames(
    "relative h-[844px] w-[390px] overflow-hidden rounded-[40px] border bg-base-100 shadow-2xl",
    tone === "dark" ? "border-base-300/40 bg-base-100/95" : "border-base-200 bg-base-100",
    className,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200/80 px-4 py-10">
      <div className={frameClasses}>
        {background ? <div className="absolute inset-0">{background}</div> : null}
        <div className="relative flex h-full flex-col">{children}</div>
      </div>
    </div>
  );
}
