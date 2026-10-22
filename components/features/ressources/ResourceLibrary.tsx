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

      <div className="mt-5 flex flex-col">
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
        "h-9 shrink-0 rounded-full border px-4 text-[13px] transition-colors duration-300",
        active
          ? "border-rr-or bg-rr-or/10 text-rr-or"
          : "border-white/[0.12] text-rr-gris-clair hover:border-rr-or/40 hover:text-rr-ivoire"
      )}
    >
      {children}
    </button>
  );
}
