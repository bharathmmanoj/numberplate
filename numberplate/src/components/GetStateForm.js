import React, { useState } from 'react';
import axios from '../services/api';
import { Box, TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const GetStateForm = () => {
  const [numberPlate, setNumberPlate] = useState('');
  const [state, setState] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGetState = async () => {
    try {
      const response = await axios.get('/get_state', { params: { number_plate: numberPlate } });
      setState(response.data.state);
      setOpenSnackbar(true);
      setSnackbarMessage(`State found: ${response.data.state}`);
    } catch (error) {
      console.error("Error fetching state", error);
      setOpenSnackbar(true);
      setSnackbarMessage('Error fetching state');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box mt={4} mb={4}>
      <Typography variant="h4" gutterBottom>
        Get State from Number Plate
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Enter Number Plate"
        value={numberPlate}
        onChange={(e) => setNumberPlate(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleGetState}>
        Get State
      </Button>
      {state && (
        <Typography variant="body1" style={{ marginTop: '1rem' }}>
          State: {state}
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

export default GetStateForm;
