import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const UpdateInquiryForm = ({ inquiry, onClose, fetchInquiries }) => {
    const [formData, setFormData] = useState({
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message,
        status: inquiry.status || 'pending' // Default to 'pending' if status doesn't exist
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/inquiries/${inquiry._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchInquiries(); // Refresh the list
                onClose(); // Close dialog
            } else {
                console.error('Failed to update inquiry');
            }
        } catch (error) {
            console.error('Error updating inquiry:', error);
        }
    };

    return (
        <>
            <DialogTitle>Update Inquiry</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            name="status"
                            value={formData.status}
                            label="Status"
                            onChange={handleChange}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="solved">Solved</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Update
                </Button>
            </DialogActions>
        </>
    );
};

export default UpdateInquiryForm;