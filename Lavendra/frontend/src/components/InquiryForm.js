import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import emailjs from '@emailjs/browser';

const InquiryForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('general'); // Default inquiry type

  const sendSubmissionEmail = (inquiry) => {
    const templateParams = {
        name: inquiry.name,
        subject: inquiry.subject,
        message: inquiry.message,
        email: inquiry.email,
    };

    emailjs.send(
        'service_ibuxp0v',
        'template_u1vy8hr',
        templateParams,
        'T4LHQzJ8ui9jA8kKM'
    ).then((res) => {
        console.log('Email sent!', res.status, res.text);
    }).catch((err) => {
        console.error('Email failed:', err);
    });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        inquiryType,
        status: 'pending', // Default status for new inquiries
      }),
    });

    if (response.ok) {
      const formData = {
        name,
        email,
        subject: inquiryType, // or 'subject' if you use that
        message
    };
    sendSubmissionEmail(formData);
      alert('Inquiry Sent Successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setInquiryType('general'); // Reset inquiry type to default
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
        bgcolor: 'background.paper',
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Inquiry Form
      </Typography>
      <form onSubmit={handleSubmit} className="inquiry-form">
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Inquiry Type</InputLabel>
          <Select
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            label="Inquiry Type"
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="support">Support</MenuItem>
            <MenuItem value="feedback">Feedback</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Inquiry
        </Button>
      </form>
    </Box>
  );
};

export default InquiryForm;
