import React, { useState } from 'react';
import axios from '../services/api';
import { Box, TextField, Button, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const GetVehicleInfoForm = () => {
  const [query, setQuery] = useState('');
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGetVehicleInfo = async () => {
    setError('');
    setInfo(null);

    try {
      const response = await axios.get('/get_vehicle_info', { params: { query } });
      setInfo(response.data);
      setOpenSnackbar(true);
      setSnackbarMessage('Vehicle information retrieved successfully');
    } catch (error) {
      console.error("Error fetching vehicle info", error);
      setOpenSnackbar(true);
      setSnackbarMessage(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box mt={4} mb={4}>
      <Typography variant="h4" gutterBottom>
        Get Vehicle Info
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Enter Number Plate, Phone No, or Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleGetVehicleInfo}>
        Get Info
      </Button>
      {error && (
        <Typography variant="body1" className="error" style={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}
      {info && (
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Number Plate</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(info).map(([numberPlate, details]) => (
                  <TableRow key={numberPlate}>
                    <TableCell>{numberPlate}</TableCell>
                    <TableCell>{details.name}</TableCell>
                    <TableCell>{details.phone_no}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default GetVehicleInfoForm;
