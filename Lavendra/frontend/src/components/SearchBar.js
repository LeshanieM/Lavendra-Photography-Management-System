import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button } from '@mui/material';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/inquiries/search', {
                params: { term: searchTerm } // Send the search term as a query parameter
            });
            onSearch(response.data); // Pass the search results to the parent component
        } catch (error) {
            console.error('Error searching inquiries:', error);
            alert('Failed to fetch search results. Please try again later.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2, // Adds spacing between the input and button
                mb: 4, // Margin bottom for spacing
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    flexGrow: 1, // Allows the input to take up remaining space
                }}
            />
            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                    height: '56px', // Matches the height of the TextField
                    px: 4, // Padding on the x-axis
                }}
            >
                Search
            </Button>
        </Box>
    );
};

export default SearchBar;