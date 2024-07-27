from google.oauth2 import service_account
from googleapiclient.discovery import build

# Define the scope required for Admin SDK
SCOPES = ['https://www.googleapis.com/auth/admin.reports.audit.readonly']

# Path to your service account key file
SERVICE_ACCOUNT_FILE = r'C:\Users\User\Downloads\summer-pattern-429310-h7-5e5ce2e3972a.json'

# Authenticate and build the Admin SDK service
def initialize_admin_service():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build('admin', 'reports_v1', credentials=credentials)
    return service

def fetch_user_activities(service):
    try:
        results = service.activities().list(
            userKey='all',
            applicationName='admin',
            startTime='2024-01-01T00:00:00Z'
        ).execute()
        return results.get('items', [])
    except Exception as e:
        print(f"Error fetching activities: {str(e)}")
        return None

# Initialize the service
def initialize_service():
    creds = authenticate()
    return build('admin', 'reports_v1', credentials=creds)

# Call the function
service = initialize_service()
activities = fetch_user_activities(service)

