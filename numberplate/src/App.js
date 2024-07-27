import React, { useEffect } from 'react';
import './App.css';
import { initClient } from './googleMeet';
import GetStateForm from './components/GetStateForm';
import AddVehicleForm from './components/AddVehicleForm';
import GetVehicleInfoForm from './components/GetVehicleInfoForm1';
import GoogleMeetButtons from './components/GoogleMeetButtons';
import { Container, Typography, CssBaseline } from '@mui/material';

function App() {
  useEffect(() => {
    initClient().then((gapi) => {
      console.log('Google API client initialized.');
    }).catch((error) => {
      console.error('Error initializing Google API client:', error);
    });
  }, []);

  
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className="App">
        <Typography variant="h3" component="h1" gutterBottom>
          Number Plate App
        </Typography>
        <GetStateForm />
        <AddVehicleForm />
        <GetVehicleInfoForm />
        <GoogleMeetButtons />
      </div>
    </Container>
  );
}

export default App;
