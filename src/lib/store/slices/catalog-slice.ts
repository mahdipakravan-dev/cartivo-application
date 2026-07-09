import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BrandFrontofficeResponse } from "@/lib/api/types";
import type { RootState } from "@/lib/store/store";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface CatalogState {
  brands: BrandFrontofficeResponse[];
  brandsStatus: RequestStatus;
  brandsError: string | null;
  hydratedAt: string | null;
}

interface BrandsHydratedPayload {
  brands: BrandFrontofficeResponse[];
  hydratedAt: string;
}

const initialState: CatalogState = {
  brands: [],
  brandsStatus: "idle",
  brandsError: null,
  hydratedAt: null,
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    brandsRequested(state) {
      state.brandsStatus = "loading";
      state.brandsError = null;
    },
    brandsHydrated(state, action: PayloadAction<BrandsHydratedPayload>) {
      state.brands = action.payload.brands;
      state.brandsStatus = "succeeded";
      state.brandsError = null;
      state.hydratedAt = action.payload.hydratedAt;
    },
    brandsRequestFailed(state, action: PayloadAction<string>) {
      state.brandsStatus = "failed";
      state.brandsError = action.payload;
    },
    brandsCleared(state) {
      state.brands = [];
      state.brandsStatus = "idle";
      state.brandsError = null;
      state.hydratedAt = null;
    },
  },
});

export const {
  brandsRequested,
  brandsHydrated,
  brandsRequestFailed,
  brandsCleared,
} = catalogSlice.actions;

export const selectCatalog = (state: RootState) => state.catalog;
export const selectBrands = (state: RootState) => state.catalog.brands;
export const selectBrandsStatus = (state: RootState) => state.catalog.brandsStatus;

export const catalogReducer = catalogSlice.reducer;
