// userInqListView.js
import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
    Box,
    Dialog,
    Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateInquiryForm from './UpdateInquiryForm';

const UserInquiryListView = ({ inquiries, fetchInquiries, userId }) => {
    const [open, setOpen] = useState(false);
    const [currentInquiry, setCurrentInquiry] = useState(null);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchInquiries();
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

    const userInquiries = inquiries.filter(inquiry => 
        inquiry.userId === userId || 
        inquiry.user?._id === userId ||
        inquiry.ownerId === userId
      );

    return (
        <>
            <List>
                {userInquiries.map((inquiry, index) => (
                    <React.Fragment key={inquiry._id || index}>
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                borderLeft: '4px solid',
                                borderLeftColor: inquiry.status === 'solved' ? 'success.main' : 'warning.main',
                                pl: 2,
                                backgroundColor: inquiry.status === 'solved' ? 'rgba(76, 175, 80, 0.08)' : 'transparent'
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <span><strong>Type:</strong> {inquiry.inquiryType}</span>
                                        <Chip
                                            label={inquiry.status || 'pending'}
                                            color={inquiry.status === 'solved' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Box>
                                }
                                secondary={
                                    <>
                                        <Box><strong>Message:</strong> {inquiry.message}</Box>
                                        <Box><strong>Email:</strong> {inquiry.email}</Box>
                                    </>
                                }
                            />
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
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
                        {index < userInquiries.length - 1 && <Divider />}
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

export default UserInquiryListView;
