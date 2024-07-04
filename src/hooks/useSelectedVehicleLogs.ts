import { useSelector } from "react-redux";
import { useVehicleLogs } from "./useVehicleLogs";
import { RootState } from "../store";
import { useMemo } from "react";

export function useSelectedVehicleLogs() {
  const logs = useVehicleLogs();
  const time = useSelector((state: RootState) => state.select.time);

  if (!time) return [];
  console.log("time", time);
  console.log("logs", logs);
  return useMemo(
    () => logs.filter((log) => log.timestamp.getTime() <= time),
    [logs, time]
  );
}
