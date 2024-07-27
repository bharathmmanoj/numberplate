
import { gapi } from 'gapi-script';

const initClient = () => {
  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'AIzaSyAW5RCWjgZI2uzZo-6BS1GDDZkorfR-0C0',  // Replace with your API key
        clientId: '1059586340559-6dkenj4q8lo84pni4dji3mko9j6vj6jo.apps.googleusercontent.com',  // Replace with your client ID
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events',
      }).then(() => {
        resolve(gapi);
      }).catch((error) => {
        reject(error);
      });
    });
  });
};

const signIn = () => {
  return gapi.auth2.getAuthInstance().signIn();
};

const createGoogleMeet = () => {
  const event = {
    'summary': 'Sample Meeting',
    'description': 'Meeting created via API',
    'start': {
      'dateTime': new Date().toISOString(),
      'timeZone': 'Asia/Kolkata',
    },
    'end': {
      'dateTime': new Date(Date.now() + 3600000).toISOString(),
      'timeZone': 'Asia/Kolkata',
    },
    'conferenceData': {
      'createRequest': {
        'requestId': 'random-string-123',
        'conferenceSolutionKey': {
          'type': 'hangoutsMeet'
        }
      }
    }
  };

  return gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event,
    'conferenceDataVersion': 1
  });
};

export { initClient, signIn, createGoogleMeet };


