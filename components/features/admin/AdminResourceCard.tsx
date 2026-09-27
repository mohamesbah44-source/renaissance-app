"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ResourceForm } from "@/components/features/admin/ResourceForm";
import { deleteResource } from "@/lib/admin/actions";
import { RESOURCE_TYPE_LABELS } from "@/lib/ressources/constants";
import type { Resource, Week } from "@/lib/types/database.types";

export function AdminResourceCard({ resource, weeks }: { resource: Resource; weeks: Week[] }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <GlassCard className="p-6">
        <ResourceForm
          resource={resource}
          weeks={weeks}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge variant="neutral">{RESOURCE_TYPE_LABELS[resource.type]}</Badge>
          <p className="mt-2 font-rr-display text-lg text-rr-ivoire">{resource.title}</p>
          {resource.description && <p className="mt-1 text-sm text-rr-gris-clair">{resource.description}</p>}
        </div>
        {resource.duration && <span className="shrink-0 text-xs text-rr-gris">{resource.duration}</span>}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-rr-or-clair transition-colors hover:text-rr-or-clair"
        >
          Modifier
        </button>
        <form action={deleteResource}>
          <input type="hidden" name="id" value={resource.id} />
          <button type="submit" className="text-xs text-white/30 transition-colors hover:text-rr-rouge">
            Supprimer
          </button>
        </form>
      </div>
    </GlassCard>
  );
}
