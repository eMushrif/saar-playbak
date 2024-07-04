// src/hooks/useRoutes.ts

import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useMemo } from "react";

export interface Route {
  id: string;
  name: string;
}

export const useRoutes = (): Route[] => {
  const trips = useSelector((state: RootState) => state.entities.trips);

  return useMemo(() => {
    // Create a Map to store unique routes
    const routesMap = new Map<string, Route>();

    // Iterate through trips to find unique routes
    trips.forEach((trip) => {
      if (!routesMap.has(trip.routeId)) {
        routesMap.set(trip.routeId, {
          id: trip.routeId,
          name: trip.routeName,
        });
      }
    });

    // Convert the Map values to an array
    return Array.from(routesMap.values());
  }, [trips]);
};
