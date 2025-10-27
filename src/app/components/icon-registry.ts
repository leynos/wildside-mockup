/** @file Maps Tabler icon component names to actual React components. */

import * as TablerIcons from "@tabler/icons-react";

/**
 * Registry of Tabler icon components keyed by their exported names.
 * The keys must align with the values stored in design token entries.
 */
export const iconRegistry = TablerIcons;

/**
 * Guard utility confirming whether a name exists within the registry.
 *
 * @param name - Icon component name returned by token resolution.
 * @returns True when the name is a registered icon component.
 */
export function isValidIconName(name: string): name is keyof typeof iconRegistry {
  return Object.hasOwn(iconRegistry, name);
}
