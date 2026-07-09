"use client";

import { useEffect } from "react";
import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { brandsHydrated } from "@/lib/store/slices/catalog-slice";
import { useAppDispatch } from "@/lib/store/hooks";

interface CatalogHydratorProps {
  brands?: BrandFrontofficeResponse[];
}

export function CatalogHydrator({ brands }: CatalogHydratorProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!brands) return;

    dispatch(
      brandsHydrated({
        brands,
        hydratedAt: new Date().toISOString(),
      }),
    );
  }, [brands, dispatch]);

  return null;
}
