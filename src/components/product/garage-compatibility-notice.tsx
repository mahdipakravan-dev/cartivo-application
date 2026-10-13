"use client";

import { BadgeCheck } from "lucide-react";
import { useGarage } from "@/components/garage/garage-provider";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { isPartCompatibleWithGarage } from "@/lib/part-compatibility";
import { cn } from "@/lib/utils";

export function GarageCompatibilityNotice({
  fitments,
  compact = false,
}: {
  fitments: PartFrontofficeResponse["fitments"];
  compact?: boolean;
}) {
  const { authenticated, vehicles } = useGarage();
  const compatible =
    authenticated &&
    vehicles.length > 0 &&
    isPartCompatibleWithGarage(fitments, vehicles);

  if (!compatible) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-emerald-50 font-bold text-emerald-700",
        compact ? "mt-3 px-3 py-2 text-[10px]" : "mt-4 px-4 py-3 text-sm",
      )}
    >
      <BadgeCheck className={cn("shrink-0", compact ? "size-3.5" : "size-5")} />
      <span>این مورد با خودرو شما سازگار است</span>
    </div>
  );
}
