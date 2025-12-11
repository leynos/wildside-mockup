/** @file Shared types for offline meta components. */

import type { JSX, ReactNode } from "react";

/**
 * Props for the meta text component used across offline UI.
 */
export type OfflineDownloadMetaProps = {
  readonly as?: "p" | "span" | "div";
  readonly className?: string;
  readonly children: ReactNode;
};

/**
 * Component type for rendering meta text in offline downloads.
 */
export type OfflineDownloadMetaComponent = (props: OfflineDownloadMetaProps) => JSX.Element;
