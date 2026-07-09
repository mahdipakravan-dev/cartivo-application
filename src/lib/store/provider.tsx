"use client";

import { useRef, type ReactNode } from "react";
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
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
