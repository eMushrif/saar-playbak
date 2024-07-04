// src/components/MapControls.tsx
import React, { useRef } from 'react';
import { ActionIcon, Center, Group, Input, InputBase, Pill, PillsInput } from '@mantine/core';
import { IconFileUpload } from '@tabler/icons-react';
import { parseTripsAndStops, parseVehicleLogs } from '../utils/parseCsv';
import { notifications } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { setEntities } from '../store/entitiesSlice';
import { Stop, Trip, VehicleLog } from '../types';
import { setRouteId, setTime, setTripId } from '../store/selectSlice';
import { RootState } from '../store';


interface UploadTripsActionProps {
  
}

const UploadTripsAction: React.FC<UploadTripsActionProps> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = useSelector((state: RootState) => state.entities.files);

  const dispatch = useDispatch();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Object.values(event?.target?.files || []).map(file => file.name);
    if(files.length !== 2 || files.some(name => !name.startsWith('trips_') && !name.startsWith('tracking_'))) {
      notifications.show({
        title: 'Invalid file(s)',
        message: 'Please upload one file with the prefix "trips_" and one file with the prefix "tracking_"',
        color: 'red',
        autoClose: 5000,
      });

      return;
    }

    let trips: Trip[] = [];
    let stops: Stop[] = [];
    let vehicleLogs: VehicleLog[] = [];
    const fileObjs = Object.values(event?.target?.files || []);
    for (const file of fileObjs) {
      if (file?.name.startsWith('trips_')) {
        try {
          const data = await parseTripsAndStops(file);

          console.log('Parsed trips:', data.trips);
          console.log('Parsed stops:', data.stops);
          
          trips = data.trips;
          stops = data.stops;
          
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      } else if(file?.name.startsWith('tracking_')) {
        try {
          const data = await parseVehicleLogs(file);
          console.log('Parsed vehicle logs:', data);
          vehicleLogs = data;
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      }
    }
    dispatch(setTime(undefined));
    dispatch(setTripId(''));
    dispatch(setRouteId(''));
    dispatch(setEntities({ files, trips, stops, vehicleLogs }));
    // notify user
    notifications.show({
      title: 'Files uploaded',
      message: 'Trips and stops uploaded successfully',
      color: 'green',
      autoClose: 5000,
    });
  };

  const handleActionIconClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Group gap="sm">
      <InputBase component='div' style={{ minWidth: 200 }} onClick={handleActionIconClick}>
        {files?.length === 0 && <Input.Placeholder>Upload CSVs</Input.Placeholder>}
        <Center h="100%">
          <Pill.Group>
            {files.map((file, index) => (
                <Pill key={index}>{file}</Pill>
              ))}
          </Pill.Group>
        </Center>
      </InputBase>
      <ActionIcon
        variant="outline"
        bg="white"
        size="lg"
        style={{
          zIndex: 1000
        }}
        onClick={handleActionIconClick}
        aria-label="Upload CSV"
      >
        <IconFileUpload size="1.5rem" />
      </ActionIcon>
      <input
        // multiple files
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleFileUpload}
      />
    </Group>
  );
};

export default UploadTripsAction;
