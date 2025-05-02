import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Nav from "../Nav/Nav";
import AdminHeader from '../../../pages/AdminHeader';

function AddNotice() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    noticeID: '',
    notice_title: '',
    posted_date: '',
    notice: ''
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history('/noticedetails'));
  };

  const sendRequest = async () => {
    await axios.post('http://localhost:5000/notices', {
      noticeID: String(inputs.noticeID),
      notice_title: String(inputs.notice_title),
      posted_date: Date(inputs.posted_date),
      notice: String(inputs.notice),
    }).then(res => res.data);
  };

  // Styles
  const formStyle = {
    background: '#ffffff',
    padding: '60px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div  className="min-h-screen bg-gray-100">
        <AdminHeader />
    <div>
      <Nav />
      <h1 style={{ textAlign: 'center' }}>Add Notice</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label htmlFor="noticeID" style={labelStyle}>Notice ID:</label>
        <input
          type="text"
          name="noticeID"
          placeholder="ID"
          value={inputs.noticeID}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <label htmlFor="notice_title" style={labelStyle}>Notice Title:</label>
        <input
          type="text"
          name="notice_title"
          placeholder="Notice Title"
          value={inputs.notice_title}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <label htmlFor="posted_date" style={labelStyle}>Notice Posted Date:</label>
        <input
          type="date"
          name="posted_date"
          value={inputs.posted_date}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <label htmlFor="notice" style={labelStyle}>Notice:</label>
        <textarea
          name="notice"
          placeholder="Notice Details"
          value={inputs.notice}
          onChange={handleChange}
          rows="5"
          required
          style={inputStyle}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
        >
          Submit Notice
        </button>
      </form>
    </div>
    </div>
  );
}

export default AddNotice;
