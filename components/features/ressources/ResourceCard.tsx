import { Dumbbell, ExternalLink, FileText, Eye, Moon, Wind, Video, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
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
    <GlassCard className="flex items-start gap-4 p-5 transition-colors hover:bg-white/[0.06]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rr-or/15">
        <Icon className="h-5 w-5 text-rr-or-clair" strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{RESOURCE_TYPE_LABELS[resource.type]}</Badge>
          {resource.duration && <span className="text-xs text-rr-gris">{resource.duration}</span>}
        </div>
        <p className="mt-2 font-rr-display text-base text-rr-ivoire">{resource.title}</p>
        {resource.description && <p className="mt-1 text-sm leading-relaxed text-rr-gris">{resource.description}</p>}
      </div>

      {resource.media_url && <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/30" />}
    </GlassCard>
  );

  if (!resource.media_url) {
    return card;
  }

  return (
    <a href={resource.media_url} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  );
}
