import { parse } from "papaparse";
import { Stop, Trip, VehicleLog } from "../types";

// Function to parse CSV and create trips and stops arrays
export function parseTripsAndStops(
  file: File
): Promise<{ trips: Trip[]; stops: Stop[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const csv = event.target?.result;
      if (typeof csv !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }

      parse(csv, {
        header: true,
        complete: (results: any) => {
          const trips: Trip[] = [];
          const stops: Stop[] = [];
          const processedTripIds = new Set<string>();

          results.data.forEach((row: any) => {
            // Process Trip
            if (!processedTripIds.has(row.tripId) && row.tripId) {
              const trip: Trip = {
                id: row.tripId,
                routeId: row.routeId,
                routeName: row.routeName,
                directionality: row.directionality,
                date: row.date,
                licensePlate: row.licensePlate,
                plannedStartTime: new Date(
                  `${row.date}T${row.plannedStartTime}`
                ),
                actualStartTime: new Date(`${row.date}T${row.actualStartTime}`),
                plannedEndTime: new Date(`${row.date}T${row.plannedEndTime}`),
                actualEndTime: new Date(`${row.date}T${row.actualEndTime}`),
                status: row.status,
                driverId: row.driverId,
                vehicleId: row.vehicleId,
                busAttendantId: row.busAttendantId,
              };
              trips.push(trip);
              processedTripIds.add(row.tripId);
            }

            // Process Stop
            const stop: Stop = {
              id: row.tripStopId,
              tripId: row.tripId,
              type: row.stopType === "Home" ? "Home" : "School",
              name:
                row.stopType === "Home"
                  ? `${row.firstName || ""} ${row.lastName || ""}`.trim()
                  : row.stopType,
              location: {
                lat: parseFloat(row.plannedLat),
                lng: parseFloat(row.plannedLon),
              },
              actualPickupTime: row.confirmedInTransitTime
                ? new Date(row.confirmedInTransitTime?.replace(" ", "T"))
                : undefined,
              actualDropoffTime: row.confirmedDropoffTime
                ? new Date(row.confirmedDropoffTime?.replace(" ", "T"))
                : undefined,
              noshowTime: row.confirmedNoShowTime
                ? new Date(row.confirmedNoShowTime?.replace(" ", "T"))
                : undefined,
              plannedPickupTime: new Date(
                row.plannedArrivalTime?.replace(" ", "T")
              ),
              plannedOrder: parseInt(row.plannedOrder),
              actualOrder: row.actualOrder
                ? parseInt(row.actualOrder)
                : undefined,
              status: row.confirmedAttendanceStatus,
            };
            stops.push(stop);
          });

          const addHours = (date: Date) => {
            return new Date(date.getTime() + 4 * 60 * 60 * 1000);
          };

          trips.forEach((trip) => {
            trip.plannedStartTime = addHours(trip.plannedStartTime);
            trip.actualStartTime = addHours(trip.actualStartTime);
            trip.plannedEndTime = addHours(trip.plannedEndTime);
            trip.actualEndTime = addHours(trip.actualEndTime);
          });

          stops.forEach((stop) => {
            stop.plannedPickupTime = addHours(stop.plannedPickupTime);
            if (stop.actualPickupTime) {
              stop.actualPickupTime = addHours(stop.actualPickupTime);
            }
            if (stop.actualDropoffTime) {
              stop.actualDropoffTime = addHours(stop.actualDropoffTime);
            }
            if (stop.noshowTime) {
              stop.noshowTime = addHours(stop.noshowTime);
            }
          });

          resolve({ trips, stops });
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}

export function parseVehicleLogs(file: File): Promise<VehicleLog[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const csv = event.target?.result;
      if (typeof csv !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }

      parse(csv, {
        header: true,
        complete: (results: any) => {
          const vehicleLogs: VehicleLog[] = [];

          results.data.forEach((row: any) => {
            if (!row.timestamp) return;
            const vehicleLog: VehicleLog = {
              // split, get the first two elements, join them with a space
              timestamp: new Date(
                row.timestamp.split(" ").slice(0, 2).join("T")
              ),
              heading: parseInt(row.heading),
              speed: parseInt(row.speed),
              location: {
                lat: parseFloat(row.latitude),
                lng: parseFloat(row.longitude),
              },
              ignition: row.ignition === "1",
              vehicleId: row.vehicleId,
            };
            vehicleLogs.push(vehicleLog);
          });

          resolve(vehicleLogs);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}
