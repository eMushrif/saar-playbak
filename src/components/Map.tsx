import React, { useRef, useEffect, useCallback, useState } from 'react';
import maplibregl, { Marker, setRTLTextPlugin } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setMapPosition } from '../store/mapSlice';
import { useMarkersData } from '../hooks/useMarkersData';
import { v4 as uuidv4 } from 'uuid';
import { Stop, VehicleLog } from '../types';
import { createPortal } from 'react-dom';
import HomeMarker from './HomeMarker';
import SchoolMarker from './SchoolMarker';
import { useSelectedVehicleLogs } from '../hooks/useSelectedVehicleLogs';
import { useVehicleLogs } from '../hooks/useVehicleLogs';
import BusMarker from './BusMarker';

setRTLTextPlugin(
  "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
  true // Lazy load the plugin
);

let markers: Marker[];
let busMarker: Marker;

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [height, setHeight] = useState(window.innerHeight);
  const [markerIds, setMarkerIds] = useState<string[] | undefined>(undefined);
  const markersData = useMarkersData();
  const polylineData = useVehicleLogs();
  const time = useSelector((state: RootState) => state.select.time);
  const [busData, setBusData] = useState<VehicleLog>();
  
  const dispatch = useDispatch();
  const { lng, lat, zoom } = useSelector((state: RootState) => state.map);

  const resize = useCallback(() => {
    setHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current) {

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=zFoMikqJO0i1CiSageLu',
        center: [lng, lat],
        zoom: zoom,
        attributionControl: false,
      });

      map.current.on('load', () => {
        resize();
      });

      map.current.on('move', () => {
        if (map.current) {
          const center = map.current.getCenter();
          dispatch(setMapPosition({
            lng: Number(center.lng.toFixed(4)),
            lat: Number(center.lat.toFixed(4)),
            zoom: Number(map.current.getZoom().toFixed(2))
          }));
        }
      });
    }

    window.addEventListener('resize', resize);

    return () => {
      if (map.current) {
        map.current.remove();
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  // markers
  useEffect(() => {
    if (!map.current) return;
    if (!markersData || markersData.length === 0) return;

    if (markers) {
      markers.forEach(marker => marker.remove());
    }
    let newMarkerIds: string[] = [];
    markers = markersData.map(cluster => {
      const newDiv = document.createElement('div');
      newDiv.style.width = 'min-content';
      newDiv.style.transform = 'translateX(-50%)';
      const newMarkerId = uuidv4();
      newDiv.id = newMarkerId;
      newMarkerIds.push(newMarkerId);

      const marker = new Marker({
        element: newDiv,
        opacityWhenCovered: "0"
      });
      marker.setLngLat([cluster[0].location.lng, cluster[0].location.lat]);
      marker.addTo(map.current!);

      return marker;
    });
    // console.log(newMarkerIds);
    setMarkerIds(newMarkerIds);
  }, [markersData]);


  // polyline
  useEffect(() => {
    if (!map.current) return;
    if (!time || !polylineData || polylineData.length === 0) return;

    // if (map.current.getLayer('route')) {
    //   map.current.removeLayer('route');
    // }

    // if ('route' && map.current.getSource('route')) {
    //   map.current.removeSource('route');
    // }

    // remove bus marker
    // if (busMarker) {
    //   busMarker.remove();
    // }

    const filteredPolyLineData = polylineData
      .filter(log => log.timestamp.getTime() <= time)
      .map(log => [log.location.lng, log.location.lat])

    // add bus marker
    if(!busMarker) {
      const newDiv = document.createElement('div');
      newDiv.style.width = 'min-content';
      newDiv.style.transform = 'translateX(-50%)';
      newDiv.id = 'busMarker';

      busMarker = new Marker({
        element: newDiv,
        opacityWhenCovered: "0"
      });

    }

    const busLocation = filteredPolyLineData[filteredPolyLineData.length - 1];
    setBusData(polylineData[polylineData.length - 1]);

    busMarker.setLngLat(busLocation as any);
    busMarker.addTo(map.current!);


    if (!map.current.getSource('route')) {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: filteredPolyLineData
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000',
          'line-width': 3
        }
      });
    } else {
      // @ts-ignore
      map.current.getSource('route').setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: filteredPolyLineData
        }
      });
    }
  }, [polylineData, time]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height }}>
      {markerIds?.map((markerId, index) => createPortal(
        markersData[index][0].type === 'Home' ?
          <HomeMarker stops={markersData[index]} /> :
          <SchoolMarker stops={markersData[index]} />,
        document.getElementById(markerId) || document.body,
        markerId
      ))}
      {busMarker && busData && createPortal(
        <BusMarker log={busData} />,
        document.getElementById('busMarker') as HTMLElement,
        'busMarker'
      )}
    </div>
  );
};

export default Map;
