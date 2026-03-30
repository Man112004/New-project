# Smart Civic Complaint Management System

Full-stack Smart Civic Complaint Management System for India built with React, Spring Boot, MySQL, JWT security, local file uploads, and Leaflet maps.

## Features

- Citizen registration and login
- Complaint creation with category, title, description, GPS coordinates, address, image, and video
- Complaint tracking with timeline, reopen flow, and service rating
- Citizen complaint map view
- Admin dashboard with filters, map, analytics, department assignment, and status updates
- Notification feed for status changes
- Excel and PDF export

## Project Structure

- `backend/` Spring Boot REST API
- `frontend/` React + Vite client

## Backend Setup

1. Create MySQL database access or use the default local configuration.
2. Update environment variables if needed:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`
   - `UPLOAD_DIR`
3. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Default seeded admin:

- Email: `admin@smartcivic.in`
- Password: `Admin@123`

## Frontend Setup

1. Install dependencies and run the client:

```bash
cd frontend
npm install
npm run dev
```

2. Optional environment variables:

```bash
VITE_API_URL=http://localhost:8080/api
VITE_FILE_BASE_URL=http://localhost:8080
```

## Suggested Future Enhancements

- Cloudinary adapter for production media storage
- Real-time WebSocket notifications
- SLA breach alerts and escalation matrix
- OTP or Aadhaar-backed identity verification
- GIS heatmaps and multilingual support
