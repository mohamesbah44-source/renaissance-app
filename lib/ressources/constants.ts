import type { ResourceType } from "@/lib/types/database.types";

export const RESOURCE_TYPES: ResourceType[] = [
  "breathwork",
  "meditation",
  "visualization",
  "pdf",
  "exercise",
  "replay",
];

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  breathwork: "Respiration",
  meditation: "Méditation",
  visualization: "Visualisation",
  pdf: "PDF",
  exercise: "Exercice",
  replay: "Replay",
};
