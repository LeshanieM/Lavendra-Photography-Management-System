import React from 'react';
import './Notice.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


function Notice(props) {
  const {_id, noticeID, notice_title,posted_date,notice} = props.notice;

  const history = useNavigate();

  const deleteHandler = async()=>{
    await axios.delete(`http://localhost:5000/notices/${_id}`)
    .then(res=>res.data)
    .then(()=>history("/"))
    .then(()=>history("/noticedetails"));

  }


  return (
    <div>
      <h1>Notice</h1>
      <br></br>
      <h1>ID: {_id}</h1>
      <h1>Notice ID : {noticeID}</h1>
      <h1>Notice Title: {notice_title}</h1>
      <h1>Posted Date: {posted_date}</h1>
      <h1>Notice: {notice}</h1>
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
    <Link
      to={`/noticedetails/${_id}`}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      Update
    </Link>

    <button
      onClick={deleteHandler}
      style={{
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      Delete
    </button>
  </div>

      <br></br><br></br>
    </div>
  );
}

export default Notice;
