/** @file Hook managing offline downloads list and managing state. */

import { useState } from "react";

import type { OfflineMapArea } from "../../../data/stage-four";
import type { DownloadEntry } from "../components/offline-download-card";

export const useOfflineDownloadsState = (initialAreas: OfflineMapArea[]) => {
  const [downloads, setDownloads] = useState<DownloadEntry[]>(() =>
    initialAreas.map((area) => ({ kind: "download", area })),
  );
  const [isManaging, setIsManaging] = useState(false);

  const handleDeleteDownload = (downloadId: string) => {
    if (!isManaging) return;
    setDownloads((current) =>
      current.map((entry) =>
        entry.area.id === downloadId ? { kind: "undo", area: entry.area } : entry,
      ),
    );
  };

  const handleUndoDownload = (downloadId: string) => {
    setDownloads((current) =>
      current.map((entry) =>
        entry.area.id === downloadId ? { kind: "download", area: entry.area } : entry,
      ),
    );
  };

  const toggleManaging = () => {
    setIsManaging((prev) => {
      if (prev) {
        setDownloads((current) => current.filter((entry) => entry.kind === "download"));
      }
      return !prev;
    });
  };

  return {
    downloads,
    isManaging,
    handleDeleteDownload,
    handleUndoDownload,
    toggleManaging,
  } as const;
};
