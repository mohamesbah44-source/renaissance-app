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
      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterButton active={activeType === "all"} onClick={() => setActiveType("all")}>
          Tout
        </FilterButton>
        {availableTypes.map((type) => (
          <FilterButton key={type} active={activeType === type} onClick={() => setActiveType(type)}>
            {RESOURCE_TYPE_LABELS[type]}
          </FilterButton>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-4">
        {filtered.length > 0 ? (
          filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
        ) : (
          <p className="text-center text-sm text-white/40">Aucune ressource pour le moment.</p>
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
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300",
        active
          ? "border-rr-or/40 bg-rr-or/15 text-rr-or-clair"
          : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/80"
      )}
    >
      {children}
    </button>
  );
}
