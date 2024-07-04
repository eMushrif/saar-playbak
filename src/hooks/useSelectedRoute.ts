// src/hooks/useSelectedRoute.ts

import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Route, useRoutes } from "./useRoute";
import { useMemo } from "react";

export const useSelectedRoute = (): Route | undefined => {
  const routes = useRoutes();
  const routeId = useSelector((state: RootState) => state.select.routeId);
  return useMemo(
    () => routes.find((route) => route.id === routeId),
    [routeId, routes]
  );
};
