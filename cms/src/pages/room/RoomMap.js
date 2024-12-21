import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function RoomMap({ roomData }) {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    if (roomData && roomData.latitude && roomData.longitude) {
      setMapData({
        latitude: roomData.latitude,
        longitude: roomData.longitude,
      });
    }
  }, [roomData]);

  if (!mapData) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={[mapData.latitude, mapData.longitude]}
      zoom={13}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[mapData.latitude, mapData.longitude]}>
        <Popup>
          Vị trí phòng: {roomData.name}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
