import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar.js';
import { 
    Typography, 
    Paper, 
    CircularProgress, 
    Box, 
    Tabs, 
    Tab
} from '@mui/material';
import InquiryList from './InquiryList';

const InquiryDashboard = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (results) => {
        setSearchResults(results);
    };

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/inquiries');
            if (!response.ok) {
                throw new Error('Failed to fetch inquiries');
            }
            const data = await response.json();
            setInquiries(data);
            setSearchResults([]); // Clear search results when fetching all inquiries
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            alert('Failed to fetch inquiries. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    useEffect(() => {
        const dataToFilter = searchResults.length > 0 ? searchResults : inquiries;
        if (tabValue === 0) { // All
            setFilteredInquiries(dataToFilter);
        } else if (tabValue === 1) { // Pending
            setFilteredInquiries(dataToFilter.filter(inq => inq.status !== 'solved'));
        } else if (tabValue === 2) { // Solved
            setFilteredInquiries(dataToFilter.filter(inq => inq.status === 'solved'));
        }
    }, [tabValue, inquiries, searchResults]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Inquiries Dashboard
            </Typography>
            <SearchBar onSearch={handleSearch} />
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="inquiry status tabs">
                    <Tab label="All" />
                    <Tab label="Pending" />
                    <Tab label="Solved" />
                </Tabs>
            </Box>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : filteredInquiries.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
                    No inquiries found {searchResults.length > 0 ? 'for your search.' : 'in this category.'}
                </Typography>
            ) : (
                <InquiryList inquiries={filteredInquiries} fetchInquiries={fetchInquiries} />
            )}
        </Paper>
    );
};

export default InquiryDashboard;