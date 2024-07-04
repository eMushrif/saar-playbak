// Define types
export type Coordinates = {
  lat: number;
  lng: number;
};

export type Trip = {
  id: string;
  routeId: string;
  routeName: string;
  directionality: "TO_SCHOOL" | "FROM_SCHOOL";
  licensePlate: string;
  date: string;
  plannedStartTime: Date;
  actualStartTime: Date;
  plannedEndTime: Date;
  actualEndTime: Date;
  status: string;
  driverId: string;
  vehicleId: string;
  busAttendantId: string;
};

export type StopType = "Home" | "School";

export type Stop = {
  id: string;
  tripId: string;
  type: StopType;
  name: string;
  location: Coordinates;
  actualPickupTime?: Date;
  actualDropoffTime?: Date;
  noshowTime?: Date;
  plannedPickupTime: Date;
  plannedOrder: number;
  actualOrder?: number;
  status: string;
};

export type VehicleLog = {
  timestamp: Date;
  heading: number;
  speed: number;
  location: Coordinates;
  ignition: boolean;
  vehicleId: string;
};
