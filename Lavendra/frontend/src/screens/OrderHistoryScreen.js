import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correct import for autoTable
import { saveAs } from 'file-saver';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        setFilteredOrders(data);
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const filterOrdersByDate = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  const generateCSVReport = () => {
    if (filteredOrders.length === 0) {
      alert('No orders to export');
      return;
    }

    const headers = ['Order ID', 'Date', 'Total', 'Paid', 'Delivered'];
    const csvRows = [];

    csvRows.push(headers.join(','));
    filteredOrders.forEach(order => {
      const row = [
        order._id,
        order.createdAt.substring(0, 10),
        order.totalPrice.toFixed(2),
        order.isPaid ? order.paidAt.substring(0, 10) : 'No',
        order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `orders_report_${startDate}_to_${endDate}.csv`);
  };

  const generatePDFReport = () => {
    if (filteredOrders.length === 0) {
      alert('No orders to export');
      return;
    }

    const doc = new jsPDF();
    const title = `Order History Report (${startDate} to ${endDate})`;
    
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const tableData = filteredOrders.map(order => [
      order._id,
      order.createdAt.substring(0, 10),
      `$${order.totalPrice.toFixed(2)}`,
      order.isPaid ? order.paidAt.substring(0, 10) : 'No',
      order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'
    ]);

    // Use the autoTable function directly
    autoTable(doc, {
      head: [['Order ID', 'Date', 'Total', 'Paid', 'Delivered']],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 }
      }
    });

    doc.save(`orders_report_${startDate}_to_${endDate}.pdf`);
  };

  const generateReport = () => {
    if (reportFormat === 'pdf') {
      generatePDFReport();
    } else {
      generateCSVReport();
    }
  };

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>

      <div className="mb-4">
        <div className="row">
          <div className="col-md-3">
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col-md-3">
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button
              variant="primary"
              onClick={filterOrdersByDate}
              disabled={!startDate || !endDate}
            >
              Filter
            </Button>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <Form.Group controlId="reportFormat">
              <Form.Label>Report Format</Form.Label>
              <Form.Select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <Button
              variant="success"
              onClick={generateReport}
              disabled={filteredOrders.length === 0}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}