import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Download, PictureAsPdf, GridOn } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AdminPaymentView = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/payments`);
        setPayments(data);
        setFilteredPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load payments',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    let result = [...payments];
    
    // Status filter
    //if (tabValue === 1) result = result.filter(pmt => pmt.paymentStatus === 'pending');
    //if (tabValue === 2) result = result.filter(pmt => pmt.paymentStatus === 'completed');
    
    // Search filter
    if (search) {
      result = result.filter(pmt =>
        pmt.name.toLowerCase().includes(search.toLowerCase()) ||
        pmt.email.toLowerCase().includes(search.toLowerCase()) ||
        pmt.paymentStatus.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Date filter
    if (startDate && endDate) {
      result = result.filter(pmt => {
        const createdAt = dayjs(pmt.createdAt);
        return createdAt.isAfter(startDate.startOf('day')) && createdAt.isBefore(endDate.endOf('day'));
      });
    }
    
    setFilteredPayments(result);
  }, [search, startDate, endDate, payments, tabValue]);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('Lavendra Photography - Payment Report', 14, 20);
    
    // Date Range
    if (startDate && endDate) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Date Range: ${startDate.format('MM/DD/YYYY')} - ${endDate.format('MM/DD/YYYY')}`,
        14,
        28
      );
    }
    
    // Status Filter
    if (tabValue === 1) doc.text('Status: Pending Payments', 14, 35);
    if (tabValue === 2) doc.text('Status: Completed Payments', 14, 35);
    
    // Table Data
    autoTable(doc, {
      startY: 40,
      head: [['Name', 'Email', 'Amount (LKR)', 'Status', 'Date']],
      body: filteredPayments.map(p => [
        p.name,
        p.email,
        p.amount,
        p.paymentStatus,
        dayjs(p.createdAt).format('MM/DD/YYYY hh:mm A')
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    doc.save('payments-report.pdf');
    handleMenuClose();
  };

  const generateExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPayments.map(payment => ({
        Name: payment.name,
        Email: payment.email,
        'Amount (LKR)': payment.amount,
        Status: payment.paymentStatus,
        Date: dayjs(payment.createdAt).format('MM/DD/YYYY hh:mm A')
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, `payments-report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    handleMenuClose();
  };

  const generateCSVReport = () => {
    const headers = "Name,Email,Amount (LKR),Status,Date\n";
    const rows = filteredPayments.map(payment => 
      `"${payment.name}","${payment.email}",${payment.amount},"${payment.paymentStatus}","${dayjs(payment.createdAt).format('MM/DD/YYYY hh:mm A')}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments-report_${dayjs().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const resetFilters = () => {
    setSearch('');
    setStartDate(null);
    setEndDate(null);
    setTabValue(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Admin Payment Dashboard</Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All" />
          </Tabs>
          <Button 
    variant="contained" 
    color="secondary" 
    onClick={() => window.open('https://dashboard.stripe.com/test/dashboard', '_blank')}
  >
    Go to Stripe Dashboard
  </Button>
          
          {filteredPayments.length > 0 && (
            <>
              <IconButton 
                color="primary" 
                onClick={handleMenuOpen}
                sx={{ border: '1px solid', p: 1 }}
                aria-label="export report"
              >
                <Download />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={generatePDFReport}>
                  <PictureAsPdf sx={{ mr: 1 }} /> PDF Report
                </MenuItem>
                <MenuItem onClick={generateExcelReport}>
                  <GridOn sx={{ mr: 1 }} /> Excel Report
                </MenuItem>
                <MenuItem onClick={generateCSVReport}>
                  <GridOn sx={{ mr: 1 }} /> CSV Export
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Search by Name, Email or Status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            slotProps={{ textField: { size: 'small' } }}
          />
          <Button variant="outlined" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
          Showing {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
          {startDate && endDate && (
            ` between ${startDate.format('MM/DD/YYYY')} and ${endDate.format('MM/DD/YYYY')}`
          )}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Amount (LKR)</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.name}</TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.paymentStatus}</TableCell>
                    <TableCell>{dayjs(payment.createdAt).format('MM/DD/YYYY hh:mm A')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No payments found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminPaymentView;