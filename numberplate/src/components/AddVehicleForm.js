import React, { useState } from 'react';
import axios from '../services/api';
import { Box, TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const AddVehicleForm = () => {
  const [newNumberPlate, setNewNumberPlate] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddVehicle = async () => {
    setError('');

    // Validation
    const numberPlateRegex = /^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{4}$/;
    if (!numberPlateRegex.test(newNumberPlate)) {
      setError('The number plate must follow the format: 2 letters, 2 digits, 1-2 letters, 4 digits.');
      return;
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      setError('The phone number must be 10 digits.');
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError('The name must contain only letters and spaces.');
      return;
    }

    try {
      const response = await axios.post('/add_vehicle', {
        number_plate: newNumberPlate,
        name,
        phone_no: phoneNo
      });
      setOpenSnackbar(true);
      setSnackbarMessage(response.data.message);
      // Clear the form fields after successful submission
      setNewNumberPlate('');
      setName('');
      setPhoneNo('');
    } catch (error) {
      console.error("Error adding vehicle", error);
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
        Add New Vehicle Info
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Enter Number Plate"
        value={newNumberPlate}
        onChange={(e) => setNewNumberPlate(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Enter Phone No"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleAddVehicle}>
        Add Vehicle
      </Button>
      {error && (
        <Typography variant="body1" className="error" style={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddVehicleForm;
