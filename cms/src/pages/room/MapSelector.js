import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapSelector({ onLocationSelect }) {
    const mapRef = useRef(null);
    const [position, setPosition] = useState({ lat: 10.762622, lng: 106.660172 }); // Vị trí mặc định (TP. Hồ Chí Minh)

    useEffect(() => {
        // Khởi tạo bản đồ
        const map = L.map(mapRef.current).setView([position.lat, position.lng], 13);

        // Thêm tile layer từ OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Thêm marker và xử lý sự kiện di chuyển
        const marker = L.marker([position.lat, position.lng], { draggable: true }).addTo(map);

        marker.on('moveend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            setPosition({ lat, lng });
            if (onLocationSelect) onLocationSelect({ lat, lng }); // Gửi dữ liệu vị trí cho parent
        });

        return () => map.remove();
    }, []);

    return (
        <div>
            <div style={{ height: '400px', width: '100%' }} ref={mapRef}></div>
            <div>Vị trí hiện tại: {position.lat}, {position.lng}</div>
        </div>
    );
}
