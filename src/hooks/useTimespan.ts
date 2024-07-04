import { useSelector } from "react-redux";
import { useSelectedTrip } from "./useSelectedTrip";
import { useMemo } from "react";
import { RootState } from "../store";

export function useTimespan() {
  const trip = useSelectedTrip();
  const vehicleLogs = useSelector(
    (state: RootState) => state.entities.vehicleLogs
  );

  return useMemo(() => {
    if (!trip) return null;

    const filteredLogs = vehicleLogs.filter(
      (log) => log.vehicleId === trip.vehicleId
    );
    filteredLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const firstLog = filteredLogs[0];
    const lastLog = filteredLogs[filteredLogs.length - 1];

    return {
      start: firstLog.timestamp,
      end: lastLog.timestamp,
    };
  }, [trip, vehicleLogs]);
}
