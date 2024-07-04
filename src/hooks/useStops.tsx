// src/hooks/useStudents.ts

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useSelectedTrip } from './useSelectedTrip';
import { Stop } from '../types';
import { useMemo } from 'react';

export const useStops = (): Stop[] => {
  const selectedTrip = useSelectedTrip();
  const stops = useSelector((state: RootState) => state.entities.stops);

  return useMemo(() => {
    if (!selectedTrip) {
      return [];
    }

    // Filter stops for the selected trip and create student objects
    const filteredStops = stops
      .filter(stop => stop.tripId === selectedTrip.id)

    filteredStops.sort((a, b) => a.plannedOrder - b.plannedOrder);

    return filteredStops;
  }, [selectedTrip, stops]);
};
