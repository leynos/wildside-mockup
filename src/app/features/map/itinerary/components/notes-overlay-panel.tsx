/** @file Overlay panel displaying route notes. */

import type { JSX } from "react";

import type { RouteNote } from "../../../../data/map";
import { pickLocalization } from "../../../../domain/entities/localization";

export type NotesOverlayPanelProps = {
  readonly notes: readonly RouteNote[];
  readonly language: string;
};

export function NotesOverlayPanel({ notes, language }: NotesOverlayPanelProps): JSX.Element {
  return (
    <div className="pointer-events-none px-6 pb-6">
      <div className="map-panel map-panel--scroll map-panel__notes">
        <p className="text-base font-semibold text-base-content">Route notes</p>
        <ul className="mt-3 route-note-list" aria-label="Route notes">
          {notes.map((note) => {
            const noteCopy = pickLocalization(note.localizations, language);
            return <li key={note.id}>{noteCopy.name}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}
