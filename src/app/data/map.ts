/** @file Fixture data powering Stage 2 map experiences. */

export interface QuickWalkConfig {
  backgroundImageUrl: string;
  backgroundAlt: string;
  defaultDuration: number;
  durationRange: { min: number; max: number; step: number };
  interestIds: string[];
}

export interface WalkPointOfInterest {
  id: string;
  name: string;
  description: string;
  tags: string[];
  rating?: number;
  imageUrl?: string;
  openHours?: string;
  categoryIcon: string;
  categoryColorClass: string;
}

export interface WalkRouteSummary {
  id: string;
  title: string;
  distance: string;
  duration: string;
  stopsCount: number;
  difficulty: string;
  rating: number;
  saves: number;
  updatedAgo: string;
  coverImageUrl: string;
  mapBackgroundUrl: string;
  mapAlt: string;
  description: string;
  highlights: string[];
  pointsOfInterest: WalkPointOfInterest[];
  notes: string[];
}

export const quickWalkConfig: QuickWalkConfig = {
  backgroundImageUrl:
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/ba98316c6a-339af7a71b2bf241cb90.png",
  backgroundAlt: "Satellite map view of the city used in the quick walk generator",
  defaultDuration: 60,
  durationRange: { min: 15, max: 180, step: 5 },
  interestIds: ["parks", "coffee", "street-art", "historic", "waterfront", "markets"],
};

export const waterfrontDiscoveryRoute: WalkRouteSummary = {
  id: "waterfront-discovery",
  title: "Waterfront Discovery Walk",
  distance: "2.3 mi",
  duration: "45 min",
  stopsCount: 6,
  difficulty: "Easy",
  rating: 4.8,
  saves: 127,
  updatedAgo: "2 days ago",
  coverImageUrl:
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/26681e8543-4aea58234426af19b1c5.png",
  mapBackgroundUrl:
    "https://storage.googleapis.com/uxpilot-auth.appspot.com/1408b2a1ec-80b4836a18f461653773.png",
  mapAlt: "Highlighted walking route weaving through parks, cafes, and waterfront landmarks",
  description:
    "A relaxed harbour-side loop that blends coffee stops, tranquil parks, and vibrant street art with sweeping skyline views.",
  highlights: ["Sunrise ready", "Pet friendly", "Café stops"],
  pointsOfInterest: [
    {
      id: "blue-bottle-coffee",
      name: "Blue Bottle Coffee",
      description: "Pour-over specialists in a cosy warehouse setting.",
      tags: ["Coffee", "Local favourite"],
      rating: 4.7,
      categoryIcon: "fa-solid fa-mug-hot",
      categoryColorClass: "text-amber-400",
      openHours: "7:00 AM – 8:00 PM",
    },
    {
      id: "harbor-pier",
      name: "Harbour Pier Lookout",
      description: "Panoramic harbour vistas – perfect for golden hour snaps.",
      tags: ["Views", "Photos", "Free"],
      rating: 4.9,
      categoryIcon: "fa-solid fa-camera",
      categoryColorClass: "text-sky-400",
      openHours: "24/7",
    },
    {
      id: "mural-alley",
      name: "Mural Alley",
      description: "Rotating gallery of local street art tucked behind the main drag.",
      tags: ["Art", "Instagram"],
      rating: 4.4,
      categoryIcon: "fa-solid fa-palette",
      categoryColorClass: "text-purple-400",
      openHours: "10:00 AM – 7:00 PM",
    },
    {
      id: "riverside-garden",
      name: "Riverside Garden",
      description: "Lush boardwalk planted with native flora and shaded seating.",
      tags: ["Nature", "Rest stop"],
      rating: 4.6,
      categoryIcon: "fa-solid fa-leaf",
      categoryColorClass: "text-emerald-400",
      openHours: "6:00 AM – 9:00 PM",
    },
    {
      id: "lighthouse-market",
      name: "Lighthouse Market",
      description: "Weekly stalls with small batch bakers, makers, and live music.",
      tags: ["Market", "Local"],
      rating: 4.5,
      categoryIcon: "fa-solid fa-store",
      categoryColorClass: "text-orange-400",
      openHours: "Saturdays 8:00 AM – 2:00 PM",
    },
    {
      id: "skyline-bridge",
      name: "Skyline Bridge",
      description: "Suspended skywalk linking two cultural precincts over the water.",
      tags: ["Architecture", "Landmark"],
      rating: 4.8,
      categoryIcon: "fa-solid fa-landmark",
      categoryColorClass: "text-cyan-300",
      openHours: "8:00 AM – 10:00 PM",
    },
  ],
  notes: [
    "Allow extra time at the harbour lookout – it becomes busy around sunset.",
    "Keep the boardwalk section for last if you plan to record timelapses.",
    "Weekend market opening times vary; check the community board for pop-up vendors.",
  ],
};

export const savedRoutes: WalkRouteSummary[] = [waterfrontDiscoveryRoute];
