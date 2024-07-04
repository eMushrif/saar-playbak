import React from 'react';
import { Select } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setRouteId } from '../store/selectSlice';
import { useRoutes } from '../hooks/useRoute';
import { useSelectedRoute } from '../hooks/useSelectedRoute';

const RouteSelect: React.FC = () => {
  const dispatch = useDispatch();
  const routes = useRoutes();
  const selectedRoute = useSelectedRoute();

  const handleRouteChange = (value: string | null) => {
    dispatch(setRouteId(value || ''));
  };

  const routeOptions = routes.map(route => ({
    value: route.id,
    label: route.name,
  }));

  return (
    <Select
    //   label="Select Route"
      placeholder="Choose a route"
      data={routeOptions}
      value={selectedRoute?.id || null}
      onChange={handleRouteChange}
      clearable
    />
  );
};

export default RouteSelect;
