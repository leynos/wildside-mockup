/** @file Hook managing offline downloads list and managing state. */

import { useCallback, useState } from "react";

import type { OfflineMapArea } from "../../../data/stage-four";
import type { DownloadEntry } from "../components/offline-download-card";

export type OfflineDownloadsState = {
  readonly downloads: DownloadEntry[];
  readonly isManaging: boolean;
  readonly handleDeleteDownload: (downloadId: string) => void;
  readonly handleUndoDownload: (downloadId: string) => void;
  readonly toggleManaging: () => void;
};

export const useOfflineDownloadsState = (initialAreas: OfflineMapArea[]): OfflineDownloadsState => {
  const [downloads, setDownloads] = useState<DownloadEntry[]>(() =>
    initialAreas.map((area) => ({ kind: "download", area })),
  );
  const [isManaging, setIsManaging] = useState(false);

  const handleDeleteDownload = useCallback(
    (downloadId: string) => {
      if (!isManaging) return;
      setDownloads((current) =>
        current.map((entry) =>
          entry.area.id === downloadId ? { kind: "undo", area: entry.area } : entry,
        ),
      );
    },
    [isManaging],
  );

  const handleUndoDownload = useCallback(
    (downloadId: string) => {
      if (!isManaging) return;
      setDownloads((current) =>
        current.map((entry) =>
          entry.area.id === downloadId ? { kind: "download", area: entry.area } : entry,
        ),
      );
    },
    [isManaging],
  );

  const toggleManaging = useCallback(() => {
    setIsManaging((prev) => {
      if (prev) {
        setDownloads((current) => current.filter((entry) => entry.kind === "download"));
      }
      return !prev;
    });
  }, []);

  return {
    downloads,
    isManaging,
    handleDeleteDownload,
    handleUndoDownload,
    toggleManaging,
  };
};
