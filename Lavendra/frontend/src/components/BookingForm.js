import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FavPackage from './SelectFavouritePackage';

function BookingForm() {
  const pricePerPhotographer = 3000;
  const pricePerHour = 1500;
  const pricePerLocation = 1000;
  const pricePer10EditedPhotos = 500;

  const [photographers, setPhotographers] = useState(1);
  const [hours, setHours] = useState(1);
  const [locations, setLocations] = useState(1);
  const [editedPhotos, setEditedPhotos] = useState(10);
  const [totalPrice, setTotalPrice] = useState(pricePerPhotographer);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [currentBookingId, setCurrentBookingId] = useState(null); // Track the booking being updated

  const calculateTotalPrice = () => {
    return (
      photographers * pricePerPhotographer +
      hours * pricePerHour +
      Math.floor(editedPhotos / 10) * pricePer10EditedPhotos +
      locations * pricePerLocation
    );
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [photographers, hours, locations, editedPhotos]);

  const handleSubmit = async () => {
    if (!date || !time || !location || !email) {
      alert('Please fill all fields before submitting');
      return;
    }

    try {
      const response = currentBookingId
        ? await fetch(
            `http://localhost:5000/api/bookings/${currentBookingId}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                photographers,
                totalPrice,
                date,
                time,
                location,
                email,
                hours,
                editedPhotos,
                locations,
              }),
            }
          )
        : await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              photographers,
              totalPrice,
              date,
              time,
              location,
              email,
              hours,
              editedPhotos,
              locations,
            }),
          });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert(data.message);
      fetchBookings();
      clearForm();
    } catch (error) {
      console.error('Error while submitting booking:', error);
      alert('Failed to save booking. Please try again.');
    }
  };

  const fetchBookings = async () => {
    const response = await fetch('http://localhost:5000/api/bookings');
    const data = await response.json();
    setBookings(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/${id}`,
          {
            method: 'DELETE',
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        alert('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        console.error('Error while deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };
  //user can chat with the photographer
  const handleSendReport = () => {
    const phoneNumber = '+94712298436';
    const message = `I want to know more details about the package `;
    const WhastsAppUrl = `https://web.whatsapp.com/send?phone=+${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(WhastsAppUrl, '_blank');
  };

  const handleUpdate = (booking) => {
    setPhotographers(booking.photographers);
    setHours(booking.hours);
    setLocations(booking.locations);
    setEditedPhotos(booking.editedPhotos);
    setTotalPrice(booking.totalPrice);
    setDate(booking.date);
    setTime(booking.time);
    setLocation(booking.location);
    setEmail(booking.email);
    setCurrentBookingId(booking._id); // Set current booking ID for update
  };

  const clearForm = () => {
    setPhotographers(1);
    setHours(1);
    setLocations(1);
    setEditedPhotos(10);
    setTotalPrice(pricePerPhotographer);
    setDate('');
    setTime('');
    setLocation('');
    setEmail('');
    setCurrentBookingId(null); // Reset the booking ID after submission
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (currentBookingId) {
      const currentBooking = bookings.find(
        (booking) => booking._id === currentBookingId
      );
      if (currentBooking) {
        setPhotographers(currentBooking.photographers);
        setHours(currentBooking.hours);
        setLocations(currentBooking.locations);
        setEditedPhotos(currentBooking.editedPhotos);
        setTotalPrice(currentBooking.totalPrice);
        setDate(currentBooking.date);
        setTime(currentBooking.time);
        setLocation(currentBooking.location);
        setEmail(currentBooking.email);
      }
    }
  }, [currentBookingId, bookings]);

  return (
    <div className="container mt-5">
      <FavPackage />

      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">Photography Package Booking</h2>

        <div className="mb-3">
          <label>Photographers:</label>
          <div className="input-group">
            <button
              className="btn btn-secondary"
              onClick={() => setPhotographers(Math.max(1, photographers - 1))}
            >
              -
            </button>
            <input
              type="number"
              className="form-control text-center"
              value={photographers}
              readOnly
            />
            <button
              className="btn btn-secondary"
              onClick={() => setPhotographers(photographers + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label>Total Price: {totalPrice}LKR</label>
        </div>

        <div className="mb-3">
          <label>Hours:</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Locations:</label>
          <input
            type="number"
            value={locations}
            onChange={(e) => setLocations(Number(e.target.value))}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Edited Photos:</label>
          <input
            type="number"
            value={editedPhotos}
            onChange={(e) => setEditedPhotos(Number(e.target.value))}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Booking Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Booking Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={!date || !time || !location || !email}
        >
          {currentBookingId ? 'Update Booking' : 'Confirm Booking'}
        </button>

        <h3 className="mt-4">Booking History</h3>
        <ul className="list-group">
          {bookings.map((booking, index) => (
            <li key={index} className="list-group-item">
              {booking.photographers} Photographers - {booking.totalPrice}LKR at{' '}
              {booking.location} on {booking.date} at {booking.time},{' '}
              {booking.hours} Hours, {booking.locations} Locations,{' '}
              {booking.editedPhotos} Edited Photos, Email: {booking.email}
              <button
                className="btn btn-warning btn-sm ml-2"
                onClick={() => handleUpdate(booking)}
              >
                Update
              </button>
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={() => handleDelete(booking._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="my-3">
        <button
          onClick={handleSendReport}
          className="btn"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          Send Message via WhatsApp
        </button>
      </div>
    </div>
  );
}

export default BookingForm;
