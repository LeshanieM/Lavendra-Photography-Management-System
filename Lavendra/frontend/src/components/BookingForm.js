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
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const handleSendWhatsApp = (booking) => {
    setSelectedBooking(booking);
    setShowWhatsappModal(true);
  };

  const confirmSendWhatsApp = () => {
    if (!whatsappNumber) {
      alert('Please enter a valid phone number');
      return;
    }

    const formattedDate = new Date(selectedBooking.date).toLocaleDateString();
    const message = `Photography Booking Details:
    
📅 Date: ${formattedDate}
⏰ Time: ${selectedBooking.time}
📍 Location: ${selectedBooking.location}
📸 Photographers: ${selectedBooking.photographers}
⏳ Duration: ${selectedBooking.hours} hours
🏞️ Locations: ${selectedBooking.locations}
🖼️ Edited Photos: ${selectedBooking.editedPhotos}
💰 Total Price: LKR ${selectedBooking.totalPrice}

Booked by: ${selectedBooking.email}

Thank you for your booking!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowWhatsappModal(false);
    setWhatsappNumber('');
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
    setCurrentBookingId(booking._id);
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
    setCurrentBookingId(null);
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
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Photographers</th>
                <th>Price</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.time}</td>
                  <td>{booking.location}</td>
                  <td>{booking.photographers}</td>
                  <td>LKR {booking.totalPrice}</td>
                  <td>{booking.email}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleUpdate(booking)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(booking._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSendWhatsApp(booking)}
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Modal */}
      {showWhatsappModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Booking Details via WhatsApp</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowWhatsappModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Enter the phone number to send booking details (include country code, e.g., +94...)</p>
                <input
                  type="tel"
                  className="form-control"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g., +94712298436"
                />
                <div className="mt-3">
                  <p><strong>Booking Details to be Sent:</strong></p>
                  <ul>
                    <li>Date: {new Date(selectedBooking?.date).toLocaleDateString()}</li>
                    <li>Time: {selectedBooking?.time}</li>
                    <li>Location: {selectedBooking?.location}</li>
                    <li>Photographers: {selectedBooking?.photographers}</li>
                    <li>Price: LKR {selectedBooking?.totalPrice}</li>
                    <li>Email: {selectedBooking?.email}</li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowWhatsappModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={confirmSendWhatsApp}
                >
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingForm;