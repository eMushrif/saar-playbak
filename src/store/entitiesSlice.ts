// src/store/entitiesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trip, Stop, VehicleLog } from "../types";

interface EntitiesState {
  files: string[];
  trips: Trip[];
  stops: Stop[];
  vehicleLogs: VehicleLog[];
}

const initialState: EntitiesState = {
  files: [],
  trips: [],
  stops: [],
  vehicleLogs: [],
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    setEntities: (state, action: PayloadAction<EntitiesState>) => {
      state.files = action.payload.files;
      state.trips = action.payload.trips;
      state.stops = action.payload.stops;
      state.vehicleLogs = action.payload.vehicleLogs;
    },
    clearAllEntities: (state) => {
      state.files = [];
      state.trips = [];
      state.stops = [];
      state.vehicleLogs = [];
    },
  },
});

export const { setEntities, clearAllEntities } = entitiesSlice.actions;

export default entitiesSlice.reducer;
