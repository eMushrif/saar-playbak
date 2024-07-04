import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Map from './components/Map';
import '@mantine/core/styles/global.layer.css';
import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';

import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Center, Flex, Group, MantineProvider } from '@mantine/core';

import UploadTripsAction from './components/UploadTripsAction';
import { Notifications } from '@mantine/notifications';
import RouteSelect from './components/RouteSelect';
import TripSelect from './components/TripSelect';
import { useTimespan } from './hooks/useTimespan';
import TimeSlider from './components/TimeSlider';
import ProgressCard from './components/ProgressCard';

console.log('App.tsx');
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Notifications />
        
        <Box style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
          <Group>
            <UploadTripsAction />
            {/* <UploadVehicleLogsAction /> */}
          </Group>
        </Box>
        <Box style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
          <Group>
            <RouteSelect />
            <TripSelect />
          </Group>
        </Box>
        <Box style={{ position: 'absolute', top: 60, left: 10, zIndex: 100, width: 420, height: 'calc(100% - 150px)', overflow: 'auto' }}>
          <ProgressCard />
        </Box>
        <Box style={{ position: 'absolute', bottom: 0, width: "calc(100% - 30px)", margin: 10, zIndex: 1}}>
          <TimeSlider />
        </Box>
        <Map />
      </MantineProvider>
    </Provider>
  );
};

export default App;