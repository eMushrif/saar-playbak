// src/hooks/useTrips.ts

import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Trip } from "../types";
import { useMemo } from "react";

export const useTrips = (): Trip[] => {
  const routeId = useSelector((state: RootState) => state.select.routeId);
  const trips = useSelector((state: RootState) => state.entities.trips);

  return useMemo(
    () => trips.filter((trip) => trip.routeId === routeId),
    [routeId, trips]
  );
};
