import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeliveryForm = () => {
  const [orderId, setOrderId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [date, setDeliveryDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Validating email and phone number
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validate whethere all fields are filled
    if (!orderId || !name || !phone || !email || !deliveryAddress || !city || !date) {
      setError("All fields are required!");
      return;
    }

    //validate email format
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    //validate phone number format
    if (!phonePattern.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    try {
      // Fetch coordinates from OpenStreetMap based on city
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: city,
          format: "json",
          limit: 1,
        },
      });

      if (!geoResponse.data || geoResponse.data.length === 0) {
        setError("Could not find coordinates for the entered address.");
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      // Send the data with the fetched coordinates and default status
      await axios.post("http://localhost:5000/api/deliveries", {
        orderId,
        name,
        phone,
        email,
        deliveryAddress,
        city,
        date,
        coordinates: [parseFloat(lat), parseFloat(lon)],
        deliveryStatus: "Pending", // default status
      });

      navigate("/deliveries");
    } catch (error) {
      console.error("Error creating delivery:", error);
      setError("Failed to create delivery. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '3rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Add Delivery</h1>
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDeliveryDate(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        <button
          type="submit"
          style={{ width: '100%', padding: '0.8rem', border: 'none', borderRadius: '4px', backgroundColor: '#3057cc', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
        >
          Submit Delivery
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;
