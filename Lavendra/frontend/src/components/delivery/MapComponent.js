import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/deliveries')
      .then((response) => {
        setDeliveries(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching deliveries:', error);
        setLoading(false);
      });
  }, []);

  const isValidCoordinates = (coordinates) => {
    return (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1])
    );
  };

  return (
    <MapContainer
      center={[6.0351, 80.217]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>Loading deliveries...</p>
      ) : (
        <MarkerClusterGroup>
          {deliveries.map(
            (delivery) =>
              isValidCoordinates(delivery.coordinates) && (
                <Marker key={delivery._id} position={delivery.coordinates}>
                  <Popup>
                    <b>Order ID:</b> {delivery.orderId} <br />
                    <b>Name:</b> {delivery.name} <br />
                    <b>Phone:</b> {delivery.phone} <br />
                    <b>Email:</b> {delivery.email} <br />
                    <b>Delivery Address:</b> {delivery.deliveryAddress} <br />
                    <b>City:</b> {delivery.city} <br />
                    <b>Date:</b> {delivery.date} <br />
                    <b>Status:</b> {delivery.deliveryStatus}
                  </Popup>
                </Marker>
              )
          )}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
};

export default MapComponent;
