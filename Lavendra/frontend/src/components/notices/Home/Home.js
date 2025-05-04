import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Nav from "../Nav/Nav";



function Home() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notices');
        setNotices(response.data.notices);
      } catch (err) {
        console.error('Error fetching notices:', err);
      }
    };

    fetchNotices();
  }, []);

  const handleSendReport = () => {
    //Create the WhatsApp Chat URL
    const phoneNumber = "+94757414833";
    const message = `I want to know more details about Notices `;
    const WhastsAppUrl = `https://web.whatsapp.com/send?phone=+${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    //Open the whatsApp Chat in new window
    window.open(WhastsAppUrl, '_blank');
  };


  return (
    <div className="home-container">
      <Nav/>
      <h1 className="home-heading">📢 Latest Notices</h1>
      <div className="notice-card-wrapper">
        {notices.map((notice, index) => (
          <div className="notice-card" key={index}>
            <h3 className="notice-title">{notice.notice_title}</h3>
            <p className="notice-date">📅 {new Date(notice.posted_date).toLocaleDateString()}</p>
            <p className="notice-text">{notice.notice}</p>
          </div>
        ))}
      </div>
      <br></br>
      <button className="whatsapp-button" onClick={handleSendReport}>Send WhatsApp Message</button>
    </div>
  );
}

export default Home;
