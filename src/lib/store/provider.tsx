"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import {
  makeStore,
  type AppStore,
  type PreloadedRootState,
} from "@/lib/store/store";

interface StoreProviderProps {
  children: ReactNode;
  preloadedState?: PreloadedRootState;
}

export function StoreProvider({ children, preloadedState }: StoreProviderProps) {
  const [store] = useState<AppStore>(() => makeStore(preloadedState));

  return <Provider store={store}>{children}</Provider>;
}
