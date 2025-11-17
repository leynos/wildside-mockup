/** @file Data backing the walk wizard flow. */

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export const wizardSteps: WizardStep[] = [
  { id: "step-1", title: "Duration & interests", description: "Set walk length and themes" },
  { id: "step-2", title: "Discovery preferences", description: "Balance hotspots vs. hidden gems" },
  { id: "step-3", title: "Review & confirm", description: "Generate the tailored walk" },
];

export interface DiscoveryPreferenceOption {
  id: string;
  label: string;
  iconToken: string;
  description: string;
}

export const accessibilityOptions: DiscoveryPreferenceOption[] = [
  {
    id: "well-lit",
    label: "Well-lit paths",
    iconToken: "{icon.object.guidance}",
    description: "Prioritise brightly lit evening routes",
  },
  {
    id: "wheelchair",
    label: "Wheelchair friendly",
    iconToken: "{icon.accessibility.stepFree}",
    description: "Smooth, wide pathways",
  },
  {
    id: "paved",
    label: "Paved surfaces",
    iconToken: "{icon.category.paved}",
    description: "Avoid dirt trails and grass",
  },
];

export interface WizardSummaryHighlight {
  readonly id: string;
  readonly iconToken: string;
  readonly labelKey: string;
  readonly defaultLabel: string;
  readonly detailKey: string;
  readonly defaultDetail: string;
}

export const wizardSummaryHighlights: ReadonlyArray<WizardSummaryHighlight> = [
  {
    id: "lighting",
    iconToken: "{icon.object.guidance}",
    labelKey: "wizard-step-two-accessibility-well-lit-label",
    defaultLabel: "Well-lit paths",
    detailKey: "wizard-step-three-highlight-lighting-detail",
    defaultDetail: "Safe evening sections with smart lighting",
  },
  {
    id: "hidden-gems",
    iconToken: "{icon.safety.hide}",
    labelKey: "wizard-step-three-highlight-hidden-gems-label",
    defaultLabel: "Hidden gems focus",
    detailKey: "wizard-step-three-highlight-hidden-gems-detail",
    defaultDetail: "Expect quiet street art laneways and indie cafés",
  },
  {
    id: "loop",
    iconToken: "{icon.object.route}",
    labelKey: "wizard-step-three-highlight-loop-label",
    defaultLabel: "Loop route",
    detailKey: "wizard-step-three-highlight-loop-detail",
    defaultDetail: "Starts and ends near your current location",
  },
  {
    id: "easy",
    iconToken: "{icon.customizer.gauge}",
    labelKey: "wizard-step-three-highlight-easy-label",
    defaultLabel: "Easy difficulty",
    detailKey: "wizard-step-three-highlight-easy-detail",
    defaultDetail: "Gradual inclines suitable for relaxed pacing",
  },
] as const;

export const wizardWeatherSummary = {
  titleKey: "wizard-step-three-weather-title",
  defaultTitle: "Perfect walking weather",
  summaryKey: "wizard-step-three-weather-summary",
  defaultSummary: "{{temperature}}, {{wind}}, {{sky}}",
  reminderKey: "wizard-step-three-weather-reminder",
  defaultReminder: "Pack light layers just in case.",
  temperatureCelsius: 22,
  windDescriptorKey: "wizard-step-three-weather-wind",
  defaultWindDescriptor: "light breeze",
  skyDescriptorKey: "wizard-step-three-weather-sky",
  defaultSkyDescriptor: "clear skies",
  sentimentKey: "wizard-step-three-weather-sentiment",
  defaultSentiment: "Ideal",
} as const;

export interface WizardGeneratedStop {
  readonly id: string;
  readonly nameKey: string;
  readonly defaultName: string;
  readonly descriptionKey: string;
  readonly defaultDescription: string;
  readonly iconToken: string;
  readonly accentClass: string;
  readonly noteKey: string;
  readonly defaultNote: string;
}

export const wizardGeneratedStops: ReadonlyArray<WizardGeneratedStop> = [
  {
    id: "café",
    nameKey: "wizard-step-three-stop-cafe-name",
    defaultName: "Midtown Roastery",
    descriptionKey: "wizard-step-three-stop-cafe-description",
    defaultDescription: "Small-batch espresso with window seating",
    iconToken: "{icon.customizer.warmBeverage}",
    accentClass: "text-amber-400",
    noteKey: "wizard-step-three-stop-cafe-note",
    defaultNote: "Friendly baristas, ideal for takeaway",
  },
  {
    id: "art",
    nameKey: "wizard-step-three-stop-art-name",
    defaultName: "Graffiti Passage",
    descriptionKey: "wizard-step-three-stop-art-description",
    defaultDescription: "Open-air gallery of rotating murals",
    iconToken: "{icon.customizer.decoration}",
    accentClass: "text-purple-400",
    noteKey: "wizard-step-three-stop-art-note",
    defaultNote: "Photo spot • 1.1 miles in",
  },
  {
    id: "garden",
    nameKey: "wizard-step-three-stop-garden-name",
    defaultName: "Whispering Oak Garden",
    descriptionKey: "wizard-step-three-stop-garden-description",
    defaultDescription: "Peaceful pocket park with shaded benches",
    iconToken: "{icon.category.trails}",
    accentClass: "text-emerald-400",
    noteKey: "wizard-step-three-stop-garden-note",
    defaultNote: "Rest area • 1.8 miles in",
  },
] as const;

export interface WizardRouteStat {
  readonly id: string;
  readonly value: string;
  readonly unitKey: string;
  readonly defaultUnit: string;
}

export interface WizardRouteSummary {
  readonly ariaLabelKey: string;
  readonly defaultAriaLabel: string;
  readonly titleKey: string;
  readonly defaultTitle: string;
  readonly badgeKey: string;
  readonly defaultBadge: string;
  readonly descriptionKey: string;
  readonly defaultDescription: string;
  readonly stats: ReadonlyArray<WizardRouteStat>;
}

export const wizardRouteSummary: WizardRouteSummary = {
  ariaLabelKey: "wizard-step-three-route-panel-aria",
  defaultAriaLabel: "Hidden gems loop summary",
  titleKey: "wizard-step-three-route-title",
  defaultTitle: "Hidden Gems Loop",
  badgeKey: "wizard-step-three-route-badge",
  defaultBadge: "Custom",
  descriptionKey: "wizard-step-three-route-description",
  defaultDescription:
    "A personalised walk blending street art laneways, independent cafés, and quiet waterfront viewpoints.",
  stats: [
    {
      id: "distance",
      value: "3.7",
      unitKey: "wizard-step-three-route-distance-unit",
      defaultUnit: "km",
    },
    {
      id: "duration",
      value: "45",
      unitKey: "wizard-step-three-route-duration-unit",
      defaultUnit: "minutes",
    },
    {
      id: "stops",
      value: "7",
      unitKey: "wizard-step-three-route-stops-unit",
      defaultUnit: "stops",
    },
  ],
} as const;
