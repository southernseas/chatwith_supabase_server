<<<<<<< HEAD
# Next.js Supabase API Server

A Next.js API server for Vercel deployment that accepts notification data and inserts it into a Supabase table.

## Features

- ✅ RESTful API endpoints
- ✅ Supabase integration
- ✅ Input validation
- ✅ CORS support
- ✅ Error handling
- ✅ TypeScript support
- ✅ Vercel deployment ready

## API Endpoints

### POST `/api/notifications`
Creates a new notification record.

**Parameters:**
- `lastname` (string, required): Last name
- `firstname` (string, required): First name  
- `email` (string, required): Email address
- `subject` (string, required): Subject line
- `details` (string, required): Message details

**Example Request:**
```bash
curl -X POST https://your-domain.vercel.app/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "lastname": "Smith",
    "firstname": "John",
    "email": "john.smith@example.com",
    "subject": "Support Request",
    "details": "I need help with my account"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "lastname": "Smith",
    "firstname": "John",
    "email": "john.smith@example.com",
    "subject": "Support Request",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET `/api/notifications/get`
Retrieves notification records with pagination.

**Query Parameters:**
- `limit` (number, optional): Number of records to return (default: 50)
- `offset` (number, optional): Number of records to skip (default: 0)
- `status` (string, optional): Filter by status

**Example Request:**
```bash
curl "https://your-domain.vercel.app/api/notifications/get?limit=10&offset=0"
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gavutzglbytyvvxmlbvt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Supabase Table Schema

Create the `chatwith_notifications` table in your Supabase database:

```sql
CREATE TABLE chatwith_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lastname VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_chatwith_notifications_email ON chatwith_notifications(email);
CREATE INDEX idx_chatwith_notifications_status ON chatwith_notifications(status);
CREATE INDEX idx_chatwith_notifications_created_at ON chatwith_notifications(created_at);
```

### 3. Installation

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

### 5. Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": [
    "lastname is required and must be a non-empty string",
    "email must be a valid email address"
  ]
}
```

## CORS Support

The API includes CORS headers to allow cross-origin requests from web applications.

## Security Considerations

- Input validation on all parameters
- Email format validation
- SQL injection protection via Supabase client
- Rate limiting (consider adding for production)
- Authentication (consider adding for production)

## Testing

You can test the API using curl, Postman, or any HTTP client:

```bash
# Test POST endpoint
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "lastname": "Doe",
    "firstname": "Jane",
    "email": "jane.doe@example.com",
    "subject": "Test Notification",
    "details": "This is a test notification"
  }'

# Test GET endpoint
curl http://localhost:3000/api/notifications/get
```
=======
# chatwith_supabase_server
>>>>>>> 245a3e6f666c105dfd0cd60173181a310a43ff28
