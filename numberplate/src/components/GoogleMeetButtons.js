import { signIn, createGoogleMeet } from '../googleMeet';
import React, { useState } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const GoogleMeetButtons = () => {
  const [meetings, setMeetings] = useState([]);

  const handleCreateMeet = async () => {
    try {
      await signIn();
      const response = await createGoogleMeet();
      const meetLink = response.result.hangoutLink;
      window.open(meetLink, '_blank');
    } catch (error) {
      console.error('Error creating or signing in to Google Meet', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fetch_meeting_details');
      const data = response.data;

      // Ensure data is an array
      if (Array.isArray(data)) {
        setMeetings(data);
      } else {
        console.error('Unexpected data format:', data);
        setMeetings([]);
      }

      console.log(data);
    } catch (error) {
      console.error('Error fetching meeting details', error);
    }
  };

  return (
    <Box mt={4} textAlign="center">
      <Button variant="contained" color="secondary" onClick={handleCreateMeet}>
        Start Google Meet
      </Button>
      <Button variant="contained" color="secondary" onClick={fetchParticipants} style={{ marginLeft: '1rem' }}>
        Fetch Meetings
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Meeting</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Attendees</TableCell>
            <TableCell>Participants</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meetings.map((meeting, index) => (
            <TableRow key={index}>
              <TableCell>{meeting.summary}</TableCell>
              <TableCell>{meeting.start}</TableCell>
              <TableCell>
                <a href={meeting.meet_link} target="_blank" rel="noopener noreferrer">Join</a>
              </TableCell>
              <TableCell>
                {meeting.attendees.map((attendee, idx) => (
                  <div key={idx}>{attendee.email} ({attendee.responseStatus})</div>
                ))}
              </TableCell>
              <TableCell>
                {meeting.participants ? meeting.participants.map((participant, idx) => (
                  <div key={idx}>{participant.participant.email} - Joined: {participant.join_time} - Left: {participant.leave_time}</div>
                )) : 'No participants'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default GoogleMeetButtons;
