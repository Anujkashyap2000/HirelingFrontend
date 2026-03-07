

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import socket from '../socket'; 


import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });
L.Marker.prototype.options.icon = DefaultIcon;


const RecenterMap = ({ pos }) => {
  const map = useMap();
  useEffect(() => {
   
    if (pos[0] !== 0 && pos[1] !== 0) {
      map.setView(pos, map.getZoom());
    }
  }, [pos, map]);
  return null;
};



const Routing = ({ workerCoords, venueCoords }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const lastUpdateRef = useRef(0);

 
  useEffect(() => {
    if (!map) return;

    routingControlRef.current = L.Routing.control({
      waypoints: [], 
      lineOptions: {
        styles: [{ color: 'blue', weight: 4 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false 
    }).addTo(map);

  
    return () => {
      if (routingControlRef.current && map) {
        try {
         
          routingControlRef.current.getPlan().setWaypoints([]); 
          map.removeControl(routingControlRef.current);
        } catch (err) {
          console.warn("Ignored Leaflet internal cleanup error:", err.message);
        }
      }
    };
  }, [map]);


  useEffect(() => {
    
    if (!routingControlRef.current || !workerCoords || !venueCoords || workerCoords[0] === 0) return;

  
    const now = Date.now();
    if (now - lastUpdateRef.current < 10000) {
       return; 
    }
    lastUpdateRef.current = now;

    const newWaypoints = [
      L.latLng(workerCoords[0], workerCoords[1]), 
      L.latLng(venueCoords[1], venueCoords[0])
    ];

    routingControlRef.current.setWaypoints(newWaypoints);

  }, [workerCoords, venueCoords]);

  return null;
};


const WorkerMap = ({ appointmentId, venueLoc }) => {

  const [myPos, setMyPos] = useState([0, 0]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setMyPos([latitude, longitude]);

        if (socket && appointmentId) {
            socket.emit("update_location", { appointmentId, lat: latitude, lon: longitude });
        }
      },
      (err) => console.error("Geolocation error:", err.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [appointmentId]);

  return (
    <MapContainer center={myPos} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <RecenterMap pos={myPos} />

      {venueLoc && venueLoc.length === 2 && (
        <Marker position={[venueLoc[1], venueLoc[0]]}>
          <Popup>Project Venue</Popup>
        </Marker>
      )}

      <Routing workerCoords={myPos} venueCoords={venueLoc} />
    </MapContainer>
  );
};

export { WorkerMap };