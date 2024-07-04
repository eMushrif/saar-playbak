import { useSelector } from "react-redux";
import { useStops } from "./useStops";
import { RootState } from "../store";
import { Stop } from "../types";
import { useMemo } from "react";

export const useSelectedStops = (): Stop[] => {
  const stops = useStops();
  const time = useSelector((state: RootState) => state.select.time);

  return useMemo(() => {
    if (!time || !stops) {
      return [];
    }
    return stops.filter(
      (stop) =>
        (stop.actualPickupTime && stop.actualPickupTime.getTime() <= time) ||
        (stop.noshowTime && stop.noshowTime.getTime() <= time)
    );
  }, [stops, time]);
};
