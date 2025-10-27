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
  id: string;
  iconToken: string;
  label: string;
  detail: string;
}

export const wizardSummaryHighlights: WizardSummaryHighlight[] = [
  {
    id: "lighting",
    iconToken: "{icon.object.guidance}",
    label: "Well-lit paths",
    detail: "Safe evening sections with smart lighting",
  },
  {
    id: "hidden-gems",
    iconToken: "{icon.safety.hide}",
    label: "Hidden gems focus",
    detail: "Expect quiet street art laneways and indie cafés",
  },
  {
    id: "loop",
    iconToken: "{icon.object.route}",
    label: "Loop route",
    detail: "Starts and ends near your current location",
  },
  {
    id: "easy",
    iconToken: "{icon.customizer.gauge}",
    label: "Easy difficulty",
    detail: "Gradual inclines suitable for relaxed pacing",
  },
];

export const wizardWeatherSummary = {
  title: "Perfect walking weather",
  summary: "72°F, light breeze, clear skies",
  temperature: "72°",
  sentiment: "Ideal",
};

export interface WizardGeneratedStop {
  id: string;
  name: string;
  description: string;
  iconToken: string;
  accentClass: string;
  note: string;
}

export const wizardGeneratedStops: WizardGeneratedStop[] = [
  {
    id: "café",
    name: "Midtown Roastery",
    description: "Small-batch espresso with window seating",
    iconToken: "{icon.customizer.warmBeverage}",
    accentClass: "text-amber-400",
    note: "Friendly baristas, ideal for takeaway",
  },
  {
    id: "art",
    name: "Graffiti Passage",
    description: "Open-air gallery of rotating murals",
    iconToken: "{icon.customizer.decoration}",
    accentClass: "text-purple-400",
    note: "Photo spot • 1.1 miles in",
  },
  {
    id: "garden",
    name: "Whispering Oak Garden",
    description: "Peaceful pocket park with shaded benches",
    iconToken: "{icon.category.trails}",
    accentClass: "text-emerald-400",
    note: "Rest area • 1.8 miles in",
  },
];
