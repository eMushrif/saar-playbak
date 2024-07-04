// src/components/TimeSlider.tsx

import React, { useEffect, useMemo } from 'react';
import { Box, Slider, Text } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useTimespan } from '../hooks/useTimespan';
import { setTime } from '../store/selectSlice';
import { RootState } from '../store';
import { formatDateNicely } from '../utils/dateToString';

const TimeSlider: React.FC = () => {
  const dispatch = useDispatch();
  const timespan = useTimespan();
  const currentTime = useSelector((state: RootState) => state.select.time);

  useEffect(() => {
    if (timespan && !currentTime) {
      dispatch(setTime(timespan.start.getTime()));
    }
  }, [timespan, currentTime, dispatch]);

  const marks = useMemo(() => {
    if (!timespan) return [];

    const duration = timespan.end.getTime() - timespan.start.getTime();
    const markCount = 5; // You can adjust this number for more or fewer marks

    return Array.from({ length: markCount }, (_, i) => {
      const value = timespan.start.getTime() + (duration * i) / (markCount - 1);
      return { value, label: formatDateNicely(new Date(value)) };
    });
  }, [timespan]);

  
  if (!timespan) {
    return null;
  }

  const handleSliderChange = (value: number) => {
    dispatch(setTime(value));
  };

  return (
    <Box style={{
      backgroundColor: 'white', 
      width: '100%', 
      padding: 30, 
      paddingTop: 15, 
      borderRadius: 5,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}>
      <Slider
        disabled={!timespan}
        min={timespan.start.getTime()}
        max={timespan.end.getTime()}
        step={1000} // 1 second steps
        value={currentTime || timespan.start.getTime()}
        onChange={handleSliderChange}
        marks={marks}
        label={(value) => formatDateNicely(new Date(value))}
      />
    </Box>
  );
};

export default TimeSlider;
