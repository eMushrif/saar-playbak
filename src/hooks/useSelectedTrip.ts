// src/hooks/useSelectedTrip.ts

import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Trip } from "../types";
import { useMemo } from "react";

export const useSelectedTrip = (): Trip | null => {
  const tripId = useSelector((state: RootState) => state.select.tripId);
  const trips = useSelector((state: RootState) => state.entities.trips);

  return useMemo(() => {
    if (!tripId) return null;

    return trips.find((trip) => trip.id === tripId) || null;
  }, [tripId, trips]);
};
