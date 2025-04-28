import React, { useEffect, useState } from 'react';
//import { List, ListItem, ListItemText } from '@mui/material'; // Add these imports
import UserInquiryListView from './UserInquiryListView';

const UserInquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const testUserEmail = "percy.demigod@iris.com"; 

    const fetchInquiries = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/inquiries");
            const data = await response.json();
            setInquiries(data);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const userInquiries = (inquiries || []).filter(inquiry => 
        inquiry.email === testUserEmail
    );

    return (
        <div>
           <h2>My Inquiries</h2>
            {userInquiries.length === 0 ? (
                <div>
                    <p>No inquiries found for {testUserEmail}</p>
                    <p>Debug: First inquiry email is {inquiries[0]?.email}</p>
                </div>
            ) : (
                <UserInquiryListView
                    inquiries={userInquiries}
                    fetchInquiries={fetchInquiries}
                    userEmail={testUserEmail} // Changed from userId
                />
            )}
        </div>
    );
};

export default UserInquiriesPage;