import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Box,
  Dialog,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateInquiryForm from './UpdateInquiryForm.js';

const InquiryList = ({ inquiries, fetchInquiries }) => {
  const [open, setOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inquiries/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        fetchInquiries(); // Refresh the list after deletion
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const handleOpenUpdate = (inquiry) => {
    setCurrentInquiry(inquiry);
    setOpen(true);
  };

  const handleCloseUpdate = () => {
    setOpen(false);
    setCurrentInquiry(null);
  };

  // Quick status update function
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inquiries/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchInquiries(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      <List>
        {inquiries.map((inquiry, index) => (
          <React.Fragment key={inquiry._id || index}>
            <ListItem
              alignItems="flex-start"
              sx={{
                borderLeft: '4px solid',
                borderLeftColor:
                  inquiry.status === 'solved' ? 'success.main' : 'warning.main',
                pl: 2,
                backgroundColor:
                  inquiry.status === 'solved'
                    ? 'rgba(76, 175, 80, 0.08)'
                    : 'transparent',
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span>
                      <strong>Name:</strong> {inquiry.name}
                    </span>
                    <Chip
                      label={inquiry.status || 'pending'}
                      color={
                        inquiry.status === 'solved' ? 'success' : 'warning'
                      }
                      size="small"
                    />
                    <Chip
                      label={inquiry.inquiryType || 'general'}
                      color="info"
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Box component="div">
                      <strong>Email:</strong> {inquiry.email}
                    </Box>
                    <Box component="div">
                      <strong>Message:</strong> {inquiry.message}
                    </Box>
                  </React.Fragment>
                }
              />
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                {inquiry.status !== 'solved' && (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => handleStatusChange(inquiry._id, 'solved')}
                  >
                    Mark Solved
                  </Button>
                )}
                {inquiry.status === 'solved' && (
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={() => handleStatusChange(inquiry._id, 'pending')}
                  >
                    Reopen
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenUpdate(inquiry)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(inquiry._id)}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
            {index < inquiries.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleCloseUpdate} maxWidth="sm" fullWidth>
        {currentInquiry && (
          <UpdateInquiryForm
            inquiry={currentInquiry}
            onClose={handleCloseUpdate}
            fetchInquiries={fetchInquiries}
          />
        )}
      </Dialog>
    </>
  );
};

export default InquiryList;
