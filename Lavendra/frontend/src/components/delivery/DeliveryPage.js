import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from "@mui/icons-material/Description";
import FilterListIcon from "@mui/icons-material/FilterList";
import AdminHeader from '../../pages/AdminHeader';

const DeliveryPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch deliveries
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/deliveries");
      setDeliveries(response.data);
      setFilteredDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      alert("Failed to fetch deliveries.");
    }
  };

  // Update delivery status
  const updateStatus = async (id, status) => {
    try {
      setLoading(true);

      await axios.put(`http://localhost:5000/api/deliveries/${id}`, { deliveryStatus: status });

      setDeliveries((prev) =>
        prev.map((d) => (d._id === id ? { ...d, deliveryStatus: status } : d))
      );
      setFilteredDeliveries((prev) =>
        prev.map((d) => (d._id === id ? { ...d, deliveryStatus: status } : d))
      );

      alert("Delivery status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a delivery
  const deleteDelivery = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this delivery?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/deliveries/${id}`);
      setDeliveries((prev) => prev.filter((d) => d._id !== id));
      setFilteredDeliveries((prev) => prev.filter((d) => d._id !== id));
      alert("Delivery deleted successfully!");
    } catch (error) {
      console.error("Error deleting delivery:", error);
      alert("Failed to delete delivery. Please try again.");
    }
  };

  // Handle Search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterDeliveries(value, statusFilter, dateFilter);
  };

  // Handle Filters
  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterDeliveries(searchQuery, value, dateFilter);
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    filterDeliveries(searchQuery, statusFilter, value);
  };

  const filterDeliveries = (query, status, date) => {
    const filtered = deliveries.filter((delivery) => {
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

  // Clear the filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDateFilter("");
    setFilteredDeliveries(deliveries);
  };

  // Navigate to the map view page
  const goToMapView = () => {
    navigate("/map");
  };

  // Generate the delivery report as a PDF
  const generateReport = () => {
    if (filteredDeliveries.length === 0) {
      alert("No deliveries to generate report.");
      return;
    }
  
    const doc = new jsPDF();
  
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
  
    const pageWidth = doc.internal.pageSize.width;
    const titleText = "Lavendra Photography";
    const subtitleText = "Delivery Report";
  
    doc.setFontSize(20);
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, (pageWidth - titleWidth) / 2, 20);
  
    doc.setFontSize(17);
    const subtitleWidth = doc.getTextWidth(subtitleText);
    doc.text(subtitleText, (pageWidth - subtitleWidth) / 2, 30);
  
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, 14, 40);
  
    const tableColumn = [
      "Order ID",
      "Name",
      "Phone",
      "Email",
      "Address",
      "City",
      "Delivery Date",
      "Status",
    ];
    const tableRows = [];
  
    filteredDeliveries.forEach((delivery) => {
      const deliveryData = [
        delivery.orderId,
        delivery.name,
        delivery.phone,
        delivery.email,
        delivery.deliveryAddress,
        delivery.city,
        delivery.date,
        delivery.deliveryStatus,
      ];
      tableRows.push(deliveryData);
    });
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { 
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [106, 27, 154],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });
  
    doc.save(`Delivery_Report_${formattedDate}.pdf`);
  };
  

  return (
    <div  className="min-h-screen bg-gray-100">
      <AdminHeader />
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Delivery Details
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3, gap: 2 }}>
        <TextField
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ width: 300 }}
        />
      </Box>

      {/* Filters and Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <FilterListIcon sx={{ color: "#6a1b9a" }} />
        <Typography variant="h6" color="#6a1b9a">
          Filters
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          mb: 3,
        }}
      >
        <Select
          value={statusFilter}
          onChange={handleStatusFilter}
          displayEmpty
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>

        <TextField
          type="date"
          value={dateFilter}
          onChange={handleDateFilter}
          sx={{ minWidth: 180 }}
        />

        <Button
          variant="contained"
          onClick={clearFilters}
          sx={{
            backgroundColor: "#6a1b9a",
            color: "white",
            width: 150,
            marginRight: 60,
            "&:hover": { backgroundColor: "#38006b" },
          }}
        >
          Clear Filters
        </Button>

        <Button
          variant="contained"
          onClick={goToMapView}
          sx={{
            backgroundColor: "#9d52b6",
            color: "white",
            width: 150,
            "&:hover": { backgroundColor: "#7b1fa2" },
          }}
        >
          <MapIcon sx={{ mr: 1 }} /> View Map
        </Button>

        <Button
          variant="contained"
          onClick={generateReport}
          sx={{
            backgroundColor: "#9d52b6",
            color: "white",
            width: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": { backgroundColor: "#7b1fa2" },
          }}
        >
          <DescriptionIcon sx={{ mr: 1 }} /> Generate Report
        </Button>
      </Box>

      {/* Delivery Cards */}
      {filteredDeliveries.length === 0 ? (
        <Typography>No deliveries found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredDeliveries.map((delivery) => (
            <Grid item xs={12} sm={6} md={4} key={delivery._id}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography><strong>Order ID:</strong> {delivery.orderId}</Typography>
                <Typography><strong>Name:</strong> {delivery.name}</Typography>
                <Typography><strong>Phone:</strong> {delivery.phone}</Typography>
                <Typography><strong>Email:</strong> {delivery.email}</Typography>
                <Typography><strong>Address:</strong> {delivery.deliveryAddress}</Typography>
                <Typography><strong>City:</strong> {delivery.city}</Typography>
                <Typography><strong>Delivery Date:</strong> {delivery.date}</Typography>
                <Typography><strong>Status:</strong> {delivery.deliveryStatus}</Typography>

                <Select
                  value={delivery.deliveryStatus}
                  onChange={(e) => updateStatus(delivery._id, e.target.value)}
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>

                <Button
                  variant="outlined"
                  onClick={() => deleteDelivery(delivery._id)}
                  sx={{
                    mt: 2,
                    borderColor: "#e53935",
                    color: "#e53935",
                    backgroundColor: "white",
                    "&:hover": {
                      borderColor: "#d32f2f",
                      color: "#d32f2f",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <DeleteIcon sx={{ mr: 1 }} /> Delete
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
    </div>
  );
};

export default DeliveryPage;
