import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapState {
  lng: number;
  lat: number;
  zoom: number;
}

const initialState: MapState = {
  lng: 55.3,
  lat: 25.3,
  zoom: 9,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapPosition: (state, action: PayloadAction<Partial<MapState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setMapPosition } = mapSlice.actions;
export default mapSlice.reducer;
