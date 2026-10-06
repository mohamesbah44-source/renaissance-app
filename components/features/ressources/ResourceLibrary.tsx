"use client";

import { useState } from "react";
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
      <div
        role="tablist"
        aria-label="Filtrer les ressources"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
        ) : (
          <p className="px-4 py-8 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
            Aucune ressource pour le moment.
          </p>
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
          ? "border-rr-or/40 bg-rr-or/[0.16] text-rr-or-clair"
          : "border-white/10 bg-white/[0.03] text-rr-gris hover:border-rr-or/30 hover:text-rr-gris-clair"
      )}
    >
      {children}
    </button>
  );
}
