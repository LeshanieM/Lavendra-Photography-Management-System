import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import AdminHeader from '../../pages/AdminHeader';

// Customizing the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Display the map with delivery locations
const MapComponent = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch delivery data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/deliveries")
      .then((response) => {
        setDeliveries(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching deliveries:", error);
        setLoading(false);
      });
  }, []);

  // Check if the coordinates are valid
  const isValidCoordinates = (coordinates) => {
    return (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1])
    );
  };

  return (
    <div  className="min-h-screen bg-gray-100">
      <AdminHeader />
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Delivery Locations
      </Typography>

      {/* Map container */}
      <Paper
        elevation={3}
        sx={{
          height: "80vh",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <MapContainer center={[6.0351, 80.217]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MarkerClusterGroup>
              {deliveries.map(
                (delivery) =>
                  isValidCoordinates(delivery.coordinates) && (
                    <Marker key={delivery._id} position={delivery.coordinates}>
                      {/* Popup content displaying delivery details */}
                      <Popup>
                        <strong>Order ID:</strong> {delivery.orderId} <br />
                        <strong>Name:</strong> {delivery.name} <br />
                        <strong>Phone:</strong> {delivery.phone} <br />
                        <strong>Email:</strong> {delivery.email} <br />
                        <strong>Address:</strong> {delivery.deliveryAddress} <br />
                        <strong>City:</strong> {delivery.city} <br />
                        <strong>Date:</strong> {delivery.date} <br />
                        <strong>Status:</strong> {delivery.deliveryStatus}
                      </Popup>
                    </Marker>
                  )
              )}
            </MarkerClusterGroup>
          </MapContainer>
        )}
      </Paper>
    </Box>
    </div>
  );
};

export default MapComponent;
