import { Dumbbell, ExternalLink, FileText, Eye, Moon, Wind, Video, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
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

  const card = (
    <GlassCard className="group flex items-start gap-5 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/30 hover:shadow-[0_14px_40px_-18px_rgba(201,169,110,0.4)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rr-or/25 bg-rr-or/[0.08] transition-all duration-300 group-hover:bg-rr-or/[0.18] group-hover:shadow-[0_0_18px_-4px_rgba(201,169,110,0.5)]">
        <Icon className="h-5 w-5 text-rr-or-clair" strokeWidth={1.5} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.25em] text-rr-gris">
          {RESOURCE_TYPE_LABELS[resource.type]}
          {resource.duration && <span className="text-rr-or"> · {resource.duration}</span>}
        </p>
        <p className="mt-2 font-rr-display text-xl leading-snug text-rr-ivoire">{resource.title}</p>
        {resource.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-rr-gris-clair">{resource.description}</p>
        )}
      </div>

      {resource.media_url && (
        <ExternalLink
          className="mt-1 h-4 w-4 shrink-0 text-rr-gris transition-colors duration-300 group-hover:text-rr-or"
          strokeWidth={1.75}
        />
      )}
    </GlassCard>
  );

  if (!resource.media_url) {
    return card;
  }

  return (
    <a href={resource.media_url} target="_blank" rel="noopener noreferrer" className="block">
      {card}
    </a>
  );
}
