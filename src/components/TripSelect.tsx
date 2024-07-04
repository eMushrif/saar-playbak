import React from 'react';
import { Select } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTripId } from '../store/selectSlice';
import { useSelectedRoute } from '../hooks/useSelectedRoute';
import { useSelectedTrip } from '../hooks/useSelectedTrip';
import { useTrips } from '../hooks/useTrips';

const TripSelect: React.FC = () => {
  const dispatch = useDispatch();
  const selectedRoute = useSelectedRoute();
  const selectedTrip = useSelectedTrip();
  const trips = useTrips();

  const handleTripChange = (value: string | null) => {
    dispatch(setTripId(value || ''));
  };

  const tripOptions = trips.map(trip => ({
    value: trip.id,
    label: `${trip.directionality === 'TO_SCHOOL' ? '☀️' : '🌙'} ${trip.date}`,
  }));

  return (
    <Select
      // label="Select Trip"
      placeholder="Choose a trip"
      data={tripOptions}
      value={selectedTrip?.id || null}
      onChange={handleTripChange}
      clearable
    />
  );
  
};

export default TripSelect;
