// MapSelector.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const MapSelector = ({ onSelectLocation }) => {
    const [position, setPosition] = useState(null);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onSelectLocation(e.latlng); // Gửi tọa độ đã chọn ra ngoài component
            },
        });

        return position ? <Marker position={position} /> : null; // Chỉ hiển thị Marker nếu có vị trí
    };

    return (
        <MapContainer center={[20.998, 105.887]} zoom={13} style={{ height: '200px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default MapSelector;
