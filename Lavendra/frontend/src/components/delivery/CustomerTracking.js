import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// Establish socket.io connection to backend
const socket = io("http://localhost:5000");

const CustomerTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [error, setError] = useState("");

  // Progress tracker
  const statusSteps = ["Pending", "Out for Delivery", "Delivered", "Completed"];
  const colors = { Pending: "green", "Out for Delivery": "green", Delivered: "green", Completed: "green" };

  useEffect(() => {
    socket.on("statusUpdated", (updatedDelivery) => {
      if (updatedDelivery.orderId === orderId) {
        setDeliveryStatus(updatedDelivery.deliveryStatus);
      }
    });

    return () => socket.off("statusUpdated");
  }, [orderId]);

  // Fetch delivery status by order ID 
  const trackOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/deliveries`);
      const delivery = response.data.find(d => d.orderId === orderId);

      if (!delivery) {
        setError("Order not found.");
        setDeliveryStatus("");
      } else {
        setDeliveryStatus(delivery.deliveryStatus);
        setError("");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError("Failed to track order.");
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#333' }}>Track Your Order</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '1rem',
            width: '300px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            transition: 'border-color 0.3s ease'
          }}
        />
        <button
          type="button"
          onClick={trackOrder}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#3057cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Track
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

      {deliveryStatus && (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', maxWidth: '500px', margin: '20px auto', position: 'relative' }}>
          {statusSteps.map((step, index) => (
            <div key={step} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
              <div
                className={`dot ${statusSteps.indexOf(deliveryStatus) >= index ? "active" : ""}`}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: statusSteps.indexOf(deliveryStatus) >= index ? colors[step] : 'gray',
                  margin: '0 auto',
                  transition: 'background-color 0.5s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              ></div>
              <p style={{ marginTop: '5px', fontSize: '12px' }}>{step}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerTracking;
