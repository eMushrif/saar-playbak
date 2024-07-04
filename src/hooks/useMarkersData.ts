import { useMemo } from "react";
import { useStops } from "./useStops";
import { Coordinates, Stop } from "../types";
import { agnes } from "ml-hclust";

function distanceInKm(a: Coordinates, b: Coordinates): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180; // deg2rad below
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  const d = R * c; // Distance in km
  return d;
}

export function useMarkersData(): Stop[][] {
  const stops = useStops();

  return useMemo(() => {
    if (!stops) {
      return [];
    }

    if (stops.length < 2) {
      return stops.map((stop) => [stop]);
    }

    const agens = agnes(stops, {
      method: "ward",
      distanceFunction: (a: Stop, b: Stop) => {
        return distanceInKm(a.location, b.location);
      },
    });

    const clusters = agens
      .cut(0.05)
      .map((cluster) => cluster.indices().map((i) => stops[i]));

    return clusters;
  }, [stops]);
}
