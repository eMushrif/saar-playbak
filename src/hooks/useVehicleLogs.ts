import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useSelectedTrip } from "./useSelectedTrip";
import { useMemo } from "react";

export function useVehicleLogs() {
  const trip = useSelectedTrip();
  const logs = useSelector((state: RootState) => state.entities.vehicleLogs);

  return useMemo(() => {
    if (!trip) return [];

    const allLogs = logs.filter((log) => log.vehicleId === trip.vehicleId);

    allLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return allLogs;
  }, [trip, logs]);
}
