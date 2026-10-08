"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ResourceCard } from "@/components/features/ressources/ResourceCard";
import { cn } from "@/lib/utils";
import { RESOURCE_TYPES, RESOURCE_TYPE_LABELS } from "@/lib/ressources/constants";
import type { Resource, ResourceType } from "@/lib/types/database.types";

interface ResourceLibraryProps {
  resources: Resource[];
}

export function ResourceLibrary({ resources }: ResourceLibraryProps) {
  const [activeType, setActiveType] = useState<ResourceType | "all">("all");

  const availableTypes = RESOURCE_TYPES.filter((type) => resources.some((resource) => resource.type === type));
  const filtered = activeType === "all" ? resources : resources.filter((resource) => resource.type === activeType);

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-rr-or/50" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">
          La bibliothèque{resources.length > 0 ? ` · ${resources.length}` : ""}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Filtrer les ressources"
        className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <FilterButton active={activeType === "all"} onClick={() => setActiveType("all")}>
          Tout
        </FilterButton>
        {availableTypes.map((type) => (
          <FilterButton key={type} active={activeType === type} onClick={() => setActiveType(type)}>
            {RESOURCE_TYPE_LABELS[type]}
          </FilterButton>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {filtered.length > 0 ? (
          filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 px-6 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rr-or/25 bg-rr-or/[0.05]">
              <Sparkles className="h-5 w-5 text-rr-or/80" strokeWidth={1.5} />
            </span>
            <p className="mt-6 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
              Aucune ressource pour le moment.
              <br />
              Les prochaines arriveront ici.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full border px-5 text-xs uppercase tracking-[0.2em] transition-all duration-300",
        active
          ? "border-rr-or/40 bg-rr-or/[0.16] text-rr-or-clair shadow-[0_0_18px_-6px_rgba(201,169,110,0.5)]"
          : "border-white/10 bg-white/[0.03] text-rr-gris hover:border-rr-or/30 hover:text-rr-gris-clair"
      )}
    >
      {children}
    </button>
  );
}
