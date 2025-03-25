import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [userRole, setUserRole] = useState("admin"); // Change dynamically based on auth
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch deliveries on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/deliveries").then((response) => {
      setDeliveries(response.data);
      setFilteredDeliveries(response.data);
    });
  }, []);

  // Update delivery status
  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/deliveries/${id}`, {
      deliveryStatus: status,
    });
    setDeliveries((prev) =>
      prev.map((d) => (d._id === id ? { ...d, deliveryStatus: status } : d))
    );
  };

  // Delete delivery with confirmation
  const deleteDelivery = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this delivery?"
    );

    if (!confirmDelete) return; // If canceled, exit

    try {
      await axios.delete(`http://localhost:5000/api/deliveries/${id}`);
      setDeliveries((prev) => prev.filter((d) => d._id !== id));
      alert("Delivery deleted successfully!");
    } catch (error) {
      console.error("Error deleting delivery:", error);
      alert("Failed to delete delivery. Please try again.");
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterDeliveries(e.target.value, statusFilter, dateFilter);
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    filterDeliveries(searchQuery, e.target.value, dateFilter);
  };

  // Handle date filter
  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
    filterDeliveries(searchQuery, statusFilter, e.target.value);
  };

  // Filter deliveries based on search, status, and date
  const filterDeliveries = (query, status, date) => {
    let filtered = deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.orderId.includes(query) ||
        delivery.name.toLowerCase().includes(query.toLowerCase()) ||
        delivery.city.toLowerCase().includes(query.toLowerCase()) ||
        delivery.email.toLowerCase().includes(query.toLowerCase()) ||
        delivery.phone.includes(query);

      const matchesStatus = status ? delivery.deliveryStatus === status : true;
      const matchesDate = date ? delivery.date.includes(date) : true;

      return matchesSearch && matchesStatus && matchesDate;
    });
    setFilteredDeliveries(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDateFilter("");
    setFilteredDeliveries(deliveries);
  };

  // Restrict access to admin and delivery roles
  if (userRole !== "admin" && userRole !== "delivery") {
    return <h2>Unauthorized Access</h2>;
  }

  return (
    <div className="delivery-container" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Delivery Details
      </h1>

      {/* Search Bar */}
      <div
        className="search-bar"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: "10px",
            fontSize: "1rem",
            width: "300px",
            border: "2px solid #ccc",
            borderRadius: "5px",
            transition: "border-color 0.3s ease",
          }}
        />
      </div>

      {/* Filters */}
      <h3>Filters</h3>
      <div
        className="filters"
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <select
          onChange={handleStatusFilter}
          value={statusFilter}
          className="filter-dropdown"
          style={{
            padding: "10px",
            fontSize: "1rem",
            border: "2px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "border-color 0.3s ease",
          }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={handleDateFilter}
          placeholder="Filter by Date"
          className="date-filter"
          style={{
            padding: "10px",
            fontSize: "1rem",
            border: "2px solid #ccc",
            borderRadius: "5px",
            transition: "border-color 0.3s ease",
          }}
        />

        <br />
        <button
          onClick={clearFilters}
          className="clear-filter-btn"
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#3057cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            width: "150px",
          }}
        >
          Clear Filters
        </button>
        <br />
        <br />
      </div>

      {/* Display Deliveries */}
      {filteredDeliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <div
          className="delivery-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredDeliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="delivery-card"
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p>
                <strong>Order ID:</strong> {delivery.orderId}
              </p>
              <p>
                <strong>Name:</strong> {delivery.name}
              </p>
              <p>
                <strong>Phone:</strong> {delivery.phone}
              </p>
              <p>
                <strong>Email:</strong> {delivery.email}
              </p>
              <p>
                <strong>Address:</strong> {delivery.deliveryAddress}
              </p>
              <p>
                <strong>City:</strong> {delivery.city}
              </p>
              <p>
                <strong>Delivery Date:</strong> {delivery.date}
              </p>
              <p>
                <strong>Status:</strong>
              </p>
              <select
                value={delivery.deliveryStatus}
                onChange={(e) => updateStatus(delivery._id, e.target.value)}
                className="filter-dropdown"
                style={{
                  padding: "10px",
                  fontSize: "1rem",
                  border: "2px solid #ccc",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => deleteDelivery(delivery._id)}
                className="delete-btn"
                style={{
                  padding: "8px 12px",
                  marginTop: "10px",
                  backgroundColor: "#3057cc",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;
