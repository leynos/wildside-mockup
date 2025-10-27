/** @file Static fixtures supporting the Discover onboarding flow. */

export interface DiscoverInterest {
  /** Stable identifier for the interest so state can store selections. */
  id: string;
  /** Display label surfaced on the chip. */
  label: string;
  /** Font Awesome icon class (e.g., `fa-solid fa-tree`). */
  icon: string;
  /** Tailwind utility describing the chip icon background tint. */
  iconBackgroundClass: string;
  /** Tailwind utility colouring the icon itself. */
  iconColorClass: string;
}

/** Curated set of interest chips that mirror the static mockup. */
export const discoverInterests: DiscoverInterest[] = [
  {
    id: "parks",
    label: "Parks & Nature",
    icon: "fa-solid fa-tree",
    iconBackgroundClass: "bg-green-500/20",
    iconColorClass: "text-green-400",
  },
  {
    id: "coffee",
    label: "Coffee Spots",
    icon: "fa-solid fa-mug-hot",
    iconBackgroundClass: "bg-amber-500/20",
    iconColorClass: "text-amber-400",
  },
  {
    id: "street-art",
    label: "Street Art",
    icon: "fa-solid fa-palette",
    iconBackgroundClass: "bg-accent/20",
    iconColorClass: "text-accent",
  },
  {
    id: "historic",
    label: "Historic Sites",
    icon: "fa-solid fa-landmark",
    iconBackgroundClass: "bg-purple-500/20",
    iconColorClass: "text-purple-400",
  },
  {
    id: "waterfront",
    label: "Waterfront",
    icon: "fa-solid fa-water",
    iconBackgroundClass: "bg-accent/20",
    iconColorClass: "text-accent",
  },
  {
    id: "markets",
    label: "Markets",
    icon: "fa-solid fa-store",
    iconBackgroundClass: "bg-orange-500/20",
    iconColorClass: "text-orange-400",
  },
];

/** The interests highlighted in the mockup when the screen first loads. */
export const defaultSelectedInterests = ["street-art", "waterfront"] as const;

export type DiscoverInterestId = (typeof discoverInterests)[number]["id"];

/**
 * Look up an interest definition by identifier.
 *
 * @example
 * ```ts
 * const streetArt = getDiscoverInterest("street-art");
 * console.log(streetArt?.label); // "Street Art"
 * ```
 */
export function getDiscoverInterest(id: DiscoverInterestId): DiscoverInterest | undefined {
  return discoverInterests.find((interest) => interest.id === id);
}
