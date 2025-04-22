import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#6a1b9a',
  boxShadow: '0 4px 10px rgba(106, 27, 154, 0.3)',
});

function AdminLogin() {
  const navigate = useNavigate();

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Admin 
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/Admin')}>
            Admin Dashboard
          </Button>

          <Button color="inherit" onClick={() => navigate('/inquiryDashboard')}>
            Inquiry
          </Button>

          <Button color="inherit" onClick={() => navigate('/deliveries')}>
            Delivery
          </Button>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default AdminLogin;
