import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Paper, 
    CircularProgress, 
    Box, 
    Tabs, 
    Tab,
    Button,
    TextField,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import { Download, PictureAsPdf, GridOn } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import SearchBar from './SearchBar';
import InquiryList from './InquiryList';

const InquiryDashboard = () => {
    // State management
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [dateRange, setDateRange] = useState([
        new Date(new Date().setDate(1)), // Start of current month
        new Date() // Today
    ]);
    const [anchorEl, setAnchorEl] = useState(null);

    // Fetch data
    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/inquiries');
            if (!response.ok) throw new Error('Failed to fetch inquiries');
            const data = await response.json();
            setInquiries(data);
            setSearchResults([]);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInquiries(); }, []);

    // Apply filters
    useEffect(() => {
        const filterInquiries = () => {
            let result = searchResults.length > 0 ? searchResults : inquiries;
            
            // Status filter
            if (tabValue === 1) result = result.filter(inq => inq.status !== 'solved');
            if (tabValue === 2) result = result.filter(inq => inq.status === 'solved');
            
            // Date filter
            if (dateRange[0] && dateRange[1]) {
                const startDate = new Date(dateRange[0]);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(dateRange[1]);
                endDate.setHours(23, 59, 59, 999);
                
                result = result.filter(inquiry => {
                    const inquiryDate = new Date(inquiry.createdAt);
                    return inquiryDate >= startDate && inquiryDate <= endDate;
                });
            }
            
            return result;
        };

        setFilteredInquiries(filterInquiries());
    }, [tabValue, inquiries, searchResults, dateRange]);

    // Report generation
    const generateCSVReport = () => {
        const headers = "ID,Type,Status,Email,Message,Created At\n";
        const rows = filteredInquiries.map(inquiry => 
            `"${inquiry._id}","${inquiry.inquiryType}","${inquiry.status}","${inquiry.email}","${inquiry.message}","${new Date(inquiry.createdAt).toLocaleString()}"`
        ).join("\n");
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inquiries_${getReportTitle()}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        handleMenuClose();
    };

    /*const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Inquiries Report - ${getReportTitle()}`, 10, 10);
        
        if (dateRange[0] && dateRange[1]) {
            doc.setFontSize(10);
            doc.text(
                `Date Range: ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`,
                10,
                20
            );
        }
        
        // Table headers
        doc.setFontSize(12);
        const headers = ["ID", "Type", "Status", "Email", "Created At"];
        const columnPositions = [10, 40, 70, 100, 150];
        headers.forEach((header, i) => doc.text(header, columnPositions[i], 30));
        
        // Table data
        let yPosition = 40;
        filteredInquiries.forEach((inquiry) => {
            doc.text(inquiry._id.substring(0, 8), 10, yPosition);
            doc.text(inquiry.inquiryType, 40, yPosition);
            doc.text(inquiry.status, 70, yPosition);
            doc.text(inquiry.email, 100, yPosition);
            doc.text(new Date(inquiry.createdAt).toLocaleDateString(), 150, yPosition);
            yPosition += 10;
            
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
        });
        
        doc.save(`inquiries_${getReportTitle()}_${new Date().toISOString().split('T')[0]}.pdf`);
        handleMenuClose();
    };*/

    const generatePDFReport = () => {
        const doc = new jsPDF();
      
        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text(`Inquiries Report - ${getReportTitle()}`, 14, 20);
      
        // Date Range
        if (dateRange[0] && dateRange[1]) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `Date Range: ${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`,
            14,
            28
          );
        }
      
        // Table Data
        autoTable(doc, {
          startY: 35,
          head: [['Type', 'Email', 'Message', 'Status']],
          body: filteredInquiries.map(i => [
            i.inquiryType,
            i.email,
            i.message,
            i.status,
          ]),
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [63, 81, 181], // Indigo header
            textColor: [255, 255, 255],
            halign: 'center',
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
        });
      
        // Save it
        doc.save('inquiries-report.pdf');
      };
      

    const generateExcelReport = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredInquiries.map(inquiry => ({
                ID: inquiry._id,
                Type: inquiry.inquiryType,
                Status: inquiry.status,
                Email: inquiry.email,
                Message: inquiry.message,
                'Created At': new Date(inquiry.createdAt).toLocaleString()
            }))
        );
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
        XLSX.writeFile(workbook, `inquiries_${getReportTitle()}_${new Date().toISOString().split('T')[0]}.xlsx`);
        handleMenuClose();
    };

    // Helper functions
    const getReportTitle = () => {
        if (searchResults.length > 0) return "Search_Results";
        if (tabValue === 1) return "Pending_Inquiries";
        if (tabValue === 2) return "Solved_Inquiries";
        return "All_Inquiries";
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleTabChange = (event, newValue) => setTabValue(newValue);
    const handleSearch = (results) => setSearchResults(results);

    const handleDateChange = (index, date) => {
        const newRange = [...dateRange];
        newRange[index] = date;
        setDateRange(newRange);
    };

    const resetFilters = () => {
        setTabValue(0);
        setSearchResults([]);
        setDateRange([new Date(new Date().setDate(1)), new Date()]);
    };

    const formatDateForInput = (date) => date?.toISOString().split('T')[0] || '';

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Inquiries Dashboard</Typography>
                
                {filteredInquiries.length > 0 && (
                    <>
                        <IconButton 
                            color="primary" 
                            onClick={handleMenuOpen}
                            sx={{ border: '1px solid', p: 1 }}
                            aria-label="export report"
                        >
                            <Download />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={generatePDFReport}>
                                <PictureAsPdf sx={{ mr: 1 }} /> PDF Report
                            </MenuItem>
                            <MenuItem onClick={generateExcelReport}>
                                <GridOn sx={{ mr: 1 }} /> Excel Report
                            </MenuItem>
                            <MenuItem onClick={generateCSVReport}>
                                <GridOn sx={{ mr: 1 }} /> CSV Export
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Box>

            <SearchBar onSearch={handleSearch} />

            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
                mb: 2,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="All" />
                    <Tab label="Pending" />
                    <Tab label="Solved" />
                </Tabs>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="From Date"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={formatDateForInput(dateRange[0])}
                        onChange={(e) => handleDateChange(0, new Date(e.target.value))}
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={formatDateForInput(dateRange[1])}
                        onChange={(e) => handleDateChange(1, new Date(e.target.value))}
                    />
                    <Button variant="outlined" onClick={resetFilters}>
                        Reset All
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : filteredInquiries.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: 1 }}>
                    <Typography variant="body1" color="textSecondary">
                        {searchResults.length > 0 
                            ? 'No matching inquiries found for your search.' 
                            : dateRange[0] && dateRange[1]
                                ? `No inquiries found between ${dateRange[0].toLocaleDateString()} and ${dateRange[1].toLocaleDateString()}`
                                : 'No inquiries found in this category.'
                        }
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Showing {filteredInquiries.length} inquiry{filteredInquiries.length !== 1 ? 's' : ''}
                        {dateRange[0] && dateRange[1] && (
                            ` between ${dateRange[0].toLocaleDateString()} and ${dateRange[1].toLocaleDateString()}`
                        )}
                    </Typography>
                    <InquiryList inquiries={filteredInquiries} fetchInquiries={fetchInquiries} />
                </>
            )}
        </Paper>
    );
};

export default InquiryDashboard;