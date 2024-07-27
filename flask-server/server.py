from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from google.oauth2 import service_account
import google.auth.transport.requests
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import datetime


# Define the scopes

app = Flask(__name__)
CORS(app)

# Load existing vehicle data from the file
VEHICLES_FILE = 'vehicles.json'
if os.path.exists(VEHICLES_FILE):
    with open(VEHICLES_FILE, 'r') as file:
        vehicles_data = json.load(file)
else:
    vehicles_data = {}

# State mapping
state_mapping = {
    "AN": "Andaman and Nicobar Islands",
    "AP": "Andhra Pradesh",
    "AR": "Arunachal Pradesh",
    "AS": "Assam",
    "BR": "Bihar",
    "CG": "Chhattisgarh",
    "CH": "Chandigarh",
    "DD": "Daman and Diu",
    "DL": "Delhi",
    "DN": "Dadra and Nagar Haveli",
    "GA": "Goa",
    "GJ": "Gujarat",
    "HR": "Haryana",
    "HP": "Himachal Pradesh",
    "JH": "Jharkhand",
    "JK": "Jammu and Kashmir",
    "KA": "Karnataka",
    "KL": "Kerala",
    "LD": "Lakshadweep",
    "MH": "Maharashtra",
    "ML": "Meghalaya",
    "MN": "Manipur",
    "MP": "Madhya Pradesh",
    "MZ": "Mizoram",
    "NL": "Nagaland",
    "OD": "Odisha",
    "PB": "Punjab",
    "PY": "Puducherry",
    "RJ": "Rajasthan",
    "SK": "Sikkim",
    "TN": "Tamil Nadu",
    "TR": "Tripura",
    "TS": "Telangana",
    "UK": "Uttarakhand",
    "UP": "Uttar Pradesh",
    "WB": "West Bengal"
}


SCOPES = ['https://www.googleapis.com/auth/calendar.events']
SERVICE_ACCOUNT_FILE = r'C:\Users\User\Downloads\summer-pattern-429310-h7-5e5ce2e3972a.json'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('meet', 'v2', credentials=credentials)
# Initialize Google Meet API client
def create_google_meet(event_summary):
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)

        service = build('calendar', 'v3', credentials='AIzaSyAW5RCWjgZI2uzZo-6BS1GDDZkorfR-0C0')

        event = {
            'summary': 'Meeting Title',
            'description': 'Meeting Description',
            'start': {
                'dateTime': '2024-07-14T09:00:00',
                'timeZone': 'Asia/Kolkata',
                },
            'end': {
                'dateTime': '2024-07-14T10:00:00',
                'timeZone': 'Asia/Kolkata',
                },
            'attendees': [
                {'email': 'attendee1@example.com'},
                {'email': 'attendee2@example.com'},
                ],
            'conferenceData': {
                'createRequest': {
                'requestId': 'random-string-123',
                'conferenceSolutionKey': {
                'type': 'hangoutsMeet'
                }
            }
            }
        }   

        event = service.events().insert(
        calendarId='primary', 
        body=event, 
        conferenceDataVersion=1
        ).execute()
        return event.get('hangoutLink')
       

    except Exception as e:
        print(f"Error creating Google Meet: {str(e)}")
        return None

# Routes
@app.route('/get_state', methods=['GET'])
def get_state():
    number_plate = request.args.get('number_plate')
    if not number_plate or len(number_plate) < 2:
        return jsonify({"error": "Invalid number plate"}), 400

    state_code = number_plate[:2].upper()
    state = state_mapping.get(state_code, "Unknown")
    return jsonify({"state": state})

@app.route('/add_vehicle', methods=['POST'])
def add_vehicle():
    data = request.json
    number_plate = data.get('number_plate')
    name = data.get('name')
    phone_no = data.get('phone_no')

    if not number_plate or not name or not phone_no:
        return jsonify({"error": "All fields are required"}), 400

    if number_plate in vehicles_data:
        return jsonify({"error": "Vehicle with this number plate already exists"}), 400

    vehicles_data[number_plate] = {
        "name": name,
        "phone_no": phone_no
    }

    # Save to file
    with open(VEHICLES_FILE, 'w') as file:
        json.dump(vehicles_data, file, indent=4)

    return jsonify({"message": "Vehicle added successfully"})

@app.route('/get_vehicle_info', methods=['GET'])
def get_vehicle_info():
    query = request.args.get('query')
    result = {}

    for number_plate, info in vehicles_data.items():
        if query in number_plate or query in info['name'] or query in info['phone_no']:
            result[number_plate] = info

    if not result:
        return jsonify({"error": "No matching vehicle found"}), 404

    return jsonify(result)

@app.route('/create_google_meet', methods=['POST'])
def create_google_meet_route():
    data = request.json
    event_summary = data.get('event_summary')

    if not event_summary:
        return jsonify({"error": "Event summary is required"}), 400

    meet_link = create_google_meet(event_summary)
    if meet_link:
        return jsonify({"meet_link": meet_link})
    else:
        return jsonify({"error": "Failed to create Google Meet"}), 500


@app.route('/fetch_meeting_details', methods=['GET'])
def fetch_meeting_details():
    try:
        creds = authenticate()
        service = build('calendar', 'v3', credentials=creds)

        now = datetime.datetime.utcnow().isoformat() + 'Z'
        events_result = service.events().list(
            calendarId='primary', timeMin=now,
            maxResults=10, singleEvents=True,
            orderBy='startTime'
        ).execute()

        events = events_result.get('items', [])
        meetings = []

        print(events)

        if not events:
            return jsonify({"message": "No recent events found."})

        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            meet_link = None
            attendees = []

            if 'conferenceData' in event:
                meet_link = event['conferenceData']['entryPoints'][0]['uri']

            if 'attendees' in event:
                attendees = [
                    {"email": attendee.get('email'), "responseStatus": attendee.get('responseStatus')}
                    for attendee in event['attendees']
                ]

            if not attendees and 'creator' in event:
                # Provide owner details if no attendees have joined
                attendees.append({"email": event['creator'].get('email'), "responseStatus": "owner"})

            meeting = {
                "summary": event['summary'],
                "start": start,
                "meet_link": meet_link,
                "attendees": attendees
            }
            meetings.append(meeting)

        return jsonify(meetings)

    except Exception as e:
        return jsonify({"error": str(e)}), 500




def authenticate():
    creds = None
    token_path = 'token.json'
    
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=8082)  # Change to a different port if needed
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    return creds


if __name__ == '__main__':
    app.run(debug=True)
