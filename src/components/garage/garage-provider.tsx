"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAccessToken } from "@/lib/api/auth-token";
import { getGarageVehicles, type GarageVehicle } from "@/lib/api/garage";

interface GarageContextValue {
  authenticated: boolean;
  vehicles: GarageVehicle[];
}

const GarageContext = createContext<GarageContextValue | null>(null);

export function GarageProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);

  useEffect(() => {
    let active = true;
    let requestSequence = 0;

    const syncGarage = () => {
      const currentRequest = ++requestSequence;
      const loggedIn = Boolean(getAccessToken());
      setAuthenticated(loggedIn);

      if (!loggedIn) {
        setVehicles([]);
        return;
      }

      getGarageVehicles()
        .then((garageVehicles) => {
          if (active && currentRequest === requestSequence) {
            setVehicles(garageVehicles);
          }
        })
        .catch(() => {
          if (active && currentRequest === requestSequence) setVehicles([]);
        });
    };

    syncGarage();
    window.addEventListener("cartivo-auth-change", syncGarage);
    window.addEventListener("cartivo-garage-change", syncGarage);
    return () => {
      active = false;
      window.removeEventListener("cartivo-auth-change", syncGarage);
      window.removeEventListener("cartivo-garage-change", syncGarage);
    };
  }, []);

  const value = useMemo(
    () => ({ authenticated, vehicles }),
    [authenticated, vehicles],
  );

  return (
    <GarageContext.Provider value={value}>{children}</GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) throw new Error("useGarage must be used within GarageProvider");
  return context;
}
