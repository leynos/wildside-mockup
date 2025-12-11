/** @file Fixture data for offline suggestions. */

import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";
import type { OfflineSuggestion } from "./stage-four";

export const offlineSuggestions: OfflineSuggestion[] = [
  {
    id: "reykjavik",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Upcoming Trip Detected",
          description: "Add Reykjavik before your Iceland trip next week",
        },
        {
          es: {
            name: "Viaje próximo detectado",
            description: "Añade Reikiavik antes de tu viaje a Islandia la próxima semana",
          },
        },
      ),
      "en-GB",
      "offline-suggestion: reykjavik",
    ),
    ctaLocalizations: fillLocalizations(
      localizeAcrossLocales(
        { name: "Download Reykjavik" },
        { es: { name: "Descargar Reikiavik" } },
      ),
      "en-GB",
      "offline-suggestion-cta: reykjavik",
    ),
    iconToken: "{icon.object.travel}",
    accentClass: "from-sky-500 via-indigo-500 to-purple-600",
    iconClassName: "text-[color:var(--b3)]",
  },
  {
    id: "kyoto",
    localizations: fillLocalizations(
      localizeAcrossLocales(
        {
          name: "Weekend City Break",
          description: "Save Kyoto before your autumn temple tour",
        },
        {
          ja: {
            name: "週末シティブレイク",
            description: "秋の寺巡りに備えて京都を保存しましょう",
          },
        },
      ),
      "en-GB",
      "offline-suggestion: kyoto",
    ),
    ctaLocalizations: fillLocalizations(
      localizeAcrossLocales({ name: "Download Kyoto" }, { ja: { name: "京都をダウンロード" } }),
      "en-GB",
      "offline-suggestion-cta: kyoto",
    ),
    iconToken: "{icon.navigation.download}",
    accentClass: "from-amber-500 via-rose-500 to-fuchsia-600",
  },
];
