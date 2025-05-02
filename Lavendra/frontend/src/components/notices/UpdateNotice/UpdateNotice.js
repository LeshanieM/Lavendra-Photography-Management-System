import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateNotice() {

  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/notices/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.notice));
    };

    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/notices/${id}`, {
        notice_title:String(inputs.notice_title),
        posted_date:Date(inputs.posted_date),
        notice:String(inputs.notice),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => 
    history('/noticedetails'));
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      <h1 style={{ textAlign: 'center', color: '#333' }}>Update Notice</h1>
      <form 
        onSubmit={handleSubmit} 
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9f9f9', padding: '60px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
      >
        <input
          type="text"
          name="notice_title"
          placeholder="Notice Title"
          value={inputs.notice_title}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          name="posted_date"
          value={inputs.posted_date}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <textarea
          name="notice"
          placeholder="Notice Details"
          value={inputs.notice}
          onChange={handleChange}
          rows="5"
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateNotice;
