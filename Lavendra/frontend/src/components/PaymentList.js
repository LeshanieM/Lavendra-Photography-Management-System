/*import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch payments on component mount
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/payments`);
                setPayments(data);
            } catch (error) {
                console.error('Error fetching payments:', error);
                setError('Failed to fetch payments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Ref for individual payment receipts
    const receiptRefs = useRef({});

    // Print handler for individual payment receipts
    const handlePrintReceipt = (paymentId) => {
        const content = receiptRefs.current[paymentId];
        if (content) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Payment Receipt - ${paymentId}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .receipt { max-width: 400px; margin: 0 auto; text-align: center; }
                            .receipt h1 { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                            .receipt h2 { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
                            .receipt p { margin-bottom: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="receipt">
                            <h1>Lavendra Photography - Capture your Best Moments</h1>
                            <h2>Payment Receipt</h2>
                            <p><strong>Name:</strong> ${content.name}</p>
                            <p><strong>Email:</strong> ${content.email}</p>
                            <p><strong>Amount:</strong> LKR ${content.amount}</p>
                            <p><strong>Status:</strong> ${content.paymentStatus}</p>
                            <p><strong>Date:</strong> ${new Date(content.createdAt).toLocaleString()}</p>
                            <p><strong>Thank you for your Payment.</strong></p>
                            <p><strong>Have a Nice Day!</strong></p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">All Payments</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Receipt</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment._id}>
                                <TableCell>{payment.name}</TableCell>
                                <TableCell>{payment.email}</TableCell>
                                <TableCell>LKR {payment.amount}</TableCell>
                                <TableCell>{payment.paymentStatus}</TableCell>
                                <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <div ref={(el) => (receiptRefs.current[payment._id] = payment)}>
                                        {/* This div is just a placeholder for the ref *//*}
                                    </div>
                                    <Button onClick={() => handlePrintReceipt(payment._id)} variant="contained" color="secondary">
                                        Download Receipt
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PaymentList;*/

import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const receiptRefs = useRef({});

  const userEmail = 'percy.demigod@iris.com'; // Target user

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/payments`);
        const filtered = data.filter(
          (payment) => payment.email?.toLowerCase() === userEmail.toLowerCase()
        );
        setPayments(filtered);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to fetch payments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handlePrintReceipt = (paymentId) => {
    const content = receiptRefs.current[paymentId];
    if (content) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${paymentId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; text-align: center; }
              .receipt h1 { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .receipt h2 { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
              .receipt p { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <h1>Lavendra Photography - Capture your Best Moments</h1>
              <h2>Payment Receipt</h2>
              <p><strong>Name:</strong> ${content.name}</p>
              <p><strong>Email:</strong> ${content.email}</p>
              <p><strong>Amount:</strong> LKR ${content.amount}</p>
              <p><strong>Status:</strong> ${content.paymentStatus}</p>
              <p><strong>Date:</strong> ${new Date(content.createdAt).toLocaleString()}</p>
              <p><strong>Thank you for your Payment.</strong></p>
              <p><strong>Have a Nice Day!</strong></p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        My Payments
      </Typography>
      {payments.length === 0 ? (
        <Typography>No payments found for {userEmail}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Receipt</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>{payment.email}</TableCell>
                  <TableCell>LKR {payment.amount}</TableCell>
                  <TableCell>{payment.paymentStatus}</TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div ref={(el) => (receiptRefs.current[payment._id] = payment)} />
                    <Button
                      onClick={() => handlePrintReceipt(payment._id)}
                      variant="contained"
                      color="secondary"
                    >
                      Download Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PaymentList;



