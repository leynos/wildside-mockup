/** @file Utility wrapper rendering map placeholders with overlay slots. */

import type { ReactNode } from "react";

export interface MapViewportProps {
  /** Background image URL representing the map snapshot. */
  backgroundImageUrl: string;
  /** Accessible description for the decorative background. */
  backgroundAlt: string;
  /** Optional overlay element rendered above the background (controls, etc.). */
  children: ReactNode;
  /** Optional gradient overlay appended above the image. */
  gradientClassName?: string;
}

/**
 * Provides a consistent map canvas with darkened imagery and overlay slots.
 *
 * @example
 * ```tsx
 * <MapViewport backgroundImageUrl="/mock.png" backgroundAlt="City map">
 *   <div className="absolute inset-0">Controls</div>
 * </MapViewport>
 * ```
 */
export function MapViewport({
  backgroundAlt,
  backgroundImageUrl,
  children,
  gradientClassName = "bg-black/50",
}: MapViewportProps): JSX.Element {
  return (
    <div className="relative flex-1 overflow-hidden">
      <img
        src={backgroundImageUrl}
        alt={backgroundAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 ${gradientClassName}`} aria-hidden="true" />
      <div className="relative z-[1] h-full w-full">{children}</div>
    </div>
  );
}
