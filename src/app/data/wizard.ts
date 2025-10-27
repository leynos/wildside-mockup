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
  icon: string;
  description: string;
}

export const accessibilityOptions: DiscoveryPreferenceOption[] = [
  {
    id: "well-lit",
    label: "Well-lit paths",
    icon: "fa-solid fa-lightbulb",
    description: "Prioritise brightly lit evening routes",
  },
  {
    id: "wheelchair",
    label: "Wheelchair friendly",
    icon: "fa-solid fa-wheelchair",
    description: "Smooth, wide pathways",
  },
  {
    id: "paved",
    label: "Paved surfaces",
    icon: "fa-solid fa-road",
    description: "Avoid dirt trails and grass",
  },
];

export interface WizardSummaryHighlight {
  id: string;
  icon: string;
  label: string;
  detail: string;
}

export const wizardSummaryHighlights: WizardSummaryHighlight[] = [
  {
    id: "lighting",
    icon: "fa-solid fa-lightbulb",
    label: "Well-lit paths",
    detail: "Safe evening sections with smart lighting",
  },
  {
    id: "hidden-gems",
    icon: "fa-solid fa-eye-slash",
    label: "Hidden gems focus",
    detail: "Expect quiet street art laneways and indie cafés",
  },
  {
    id: "loop",
    icon: "fa-solid fa-route",
    label: "Loop route",
    detail: "Starts and ends near your current location",
  },
  {
    id: "easy",
    icon: "fa-solid fa-gauge-simple",
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
  icon: string;
  accentClass: string;
  note: string;
}

export const wizardGeneratedStops: WizardGeneratedStop[] = [
  {
    id: "café",
    name: "Midtown Roastery",
    description: "Small-batch espresso with window seating",
    icon: "fa-solid fa-mug-hot",
    accentClass: "text-amber-400",
    note: "Friendly baristas, ideal for takeaway",
  },
  {
    id: "art",
    name: "Graffiti Passage",
    description: "Open-air gallery of rotating murals",
    icon: "fa-solid fa-spray-can",
    accentClass: "text-purple-400",
    note: "Photo spot • 1.1 miles in",
  },
  {
    id: "garden",
    name: "Whispering Oak Garden",
    description: "Peaceful pocket park with shaded benches",
    icon: "fa-solid fa-tree",
    accentClass: "text-emerald-400",
    note: "Rest area • 1.8 miles in",
  },
];
