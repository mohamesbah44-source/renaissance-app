import { Dumbbell, ExternalLink, FileText, Eye, Moon, Wind, Video, type LucideIcon } from "lucide-react";
import { RESOURCE_TYPE_LABELS } from "@/lib/ressources/constants";
import type { Resource, ResourceType } from "@/lib/types/database.types";

const RESOURCE_ICONS: Record<ResourceType, LucideIcon> = {
  breathwork: Wind,
  meditation: Moon,
  visualization: Eye,
  pdf: FileText,
  exercise: Dumbbell,
  replay: Video,
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = RESOURCE_ICONS[resource.type];

  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rr-or/50 text-rr-or">
        <Icon className="h-[15px] w-[15px]" strokeWidth={1.6} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-rr-serif text-[21px] italic leading-tight text-rr-ivoire">{resource.title}</p>
        <p className="mt-1 text-xs text-rr-gris-clair">
          {RESOURCE_TYPE_LABELS[resource.type]}
          {resource.duration ? ` · ${resource.duration}` : ""}
        </p>
      </div>

      {resource.media_url && (
        <ExternalLink
          className="h-4 w-4 shrink-0 text-rr-gris transition-colors duration-300 group-hover:text-rr-or"
          strokeWidth={1.75}
        />
      )}
    </>
  );

  const rowClass = "group flex items-center gap-3.5 border-b border-white/[0.08] py-4 last:border-b-0";

  if (!resource.media_url) {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <a href={resource.media_url} target="_blank" rel="noopener noreferrer" className={rowClass}>
      {content}
    </a>
  );
}
