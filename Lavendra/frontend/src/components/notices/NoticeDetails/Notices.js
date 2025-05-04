import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // explicitly importing autotable for v3+
import Addnotice from '../Notice/Notice';
import './notices.css';
import Nav from "../Nav/Nav";
import AdminHeader from '../../../pages/AdminHeader';


const URL = "http://localhost:5000/notices";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Notices() {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchHandler().then((data) => setNotices(data.notices));
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFromDate('');
    setToDate('');
  };

  const filteredNotices = notices.filter((notice) => {
    const titleMatch = notice.notice_title.toLowerCase().includes(searchTerm.toLowerCase());
    const noticeMatch = notice.notice.toLowerCase().includes(searchTerm.toLowerCase()); // Added this for "notice"
    const noticeDate = new Date(notice.posted_date);
    const isAfterFromDate = fromDate ? noticeDate >= new Date(fromDate) : true;
    const isBeforeToDate = toDate ? noticeDate <= new Date(toDate) : true;

    return (titleMatch || noticeMatch) && isAfterFromDate && isBeforeToDate;
  });

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    
    // Title and Report Date
    doc.setFontSize(18);
    doc.text('Lavendra Photography - Notice Report', 14, 20);
  
    // Date of Report Generation
    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Report generated on: ${reportDate}`, 14, 30);
  
    // Table Setup
    const tableColumn = ["Notice ID", "Notice Title", "Posted Date", "Notice"];
    const tableRows = [];
  
    filteredNotices.forEach((notice) => {
      const rowData = [
        notice.noticeID || "N/A",
        notice.notice_title,
        new Date(notice.posted_date).toLocaleDateString(),
        notice.notice
      ];
      tableRows.push(rowData);
    });
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Adjusting the starting position for the table
      styles: { fontSize: 10, cellWidth: 'wrap' },
      headStyles: { fillColor: [128, 0, 128] }, // Purple header
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { cellWidth: 35 },
        3: { cellWidth: 60 }
      }
    });
  
    // Save the document
    doc.save('Notice_Report.pdf');
  };
  

  return (
    <div  className="min-h-screen bg-gray-100">
        <AdminHeader />
    <div>
      <Nav />
      <h1>Notice Details Display Page</h1>

      {/* Search & Filter Section */}
      <div className="filter-container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search by title or notice..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: '10px',
      borderRadius: '5px',
      width: '200px',
      border: '1px solid #ccc',
      fontSize: '14px',
    }}
  />

  {/* Date Filters */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="fromDate" style={{ fontSize: '14px', marginBottom: '5px' }}>
      Start Date
    </label>
    <input
      id="fromDate"
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
      }}
    />
  </div>

  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label htmlFor="toDate" style={{ fontSize: '14px', marginBottom: '5px' }}>
      End Date
    </label>
    <input
      id="toDate"
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
      }}
    />
  </div>

  {/* Filter Buttons */}
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <button
      onClick={handleClearFilters}
      style={{
        padding: '8px 12px',
        borderRadius: '5px',
        backgroundColor: '#800080',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
      }}
    >
      Clear Filters
    </button>

    {/* Generate Report Button */}
    <button
      onClick={handleGenerateReport}
      style={{
        padding: '8px 12px',
        borderRadius: '5px',
        backgroundColor: '#6A0DAD',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: 'auto',
      }}
    >
      Generate Report
    </button>
  </div>
</div>


      {/* Notices Display */}
      <div>
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, i) => (
            <div className="notice-card" key={i}>
              <Addnotice notice={notice} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'gray' }}>No notices found.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default Notices;
