// src/store/selectSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectState {
  time?: number;
  routeId: string | null;
  tripId: string | null;
}

const initialState: SelectState = {
  time: undefined,
  routeId: null,
  tripId: null,
};

const selectSlice = createSlice({
  name: "select",
  initialState,
  reducers: {
    setRouteId: (state, action: PayloadAction<string>) => {
      state.routeId = action.payload;
    },
    setTripId: (state, action: PayloadAction<string>) => {
      state.tripId = action.payload;
    },
    setTime: (state, action: PayloadAction<number | undefined>) => {
      state.time = action.payload;
    },
  },
});

export const { setRouteId, setTripId, setTime } = selectSlice.actions;

export default selectSlice.reducer;
