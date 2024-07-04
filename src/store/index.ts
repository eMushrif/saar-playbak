import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import entitiesReducer from "./entitiesSlice";
import selectReducer from "./selectSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    entities: entitiesReducer,
    select: selectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
