# MERNPro Backend

Backend API for the MERN school management system built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Register and login for admins and parents
- **Teacher Management**: CRUD operations for teachers (admin only)
- **Attendance Tracking**: Record and update teacher attendance
- **Report System**: Parents can submit reports, admins can view and resolve them

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/mernpro
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Admin Routes (`/api/admin`) - Requires admin role
- `GET /api/admin/teachers` - Get all teachers
- `POST /api/admin/teachers` - Add new teacher
- `PUT /api/admin/teachers/:id` - Update teacher
- `DELETE /api/admin/teachers/:id` - Delete teacher
- `GET /api/admin/attendance` - Get attendance records
- `POST /api/admin/attendance` - Record attendance
- `PUT /api/admin/attendance/:id` - Update attendance
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/reports/:id/resolve` - Resolve a report

### Parent Routes (`/api/parent`) - Requires parent role
- `GET /api/parent/attendance` - View attendance
- `POST /api/parent/reports` - Submit a report
- `GET /api/parent/reports` - Get user's reports
- `GET /api/parent/teachers` - Get list of teachers

## Data Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'admin', 'parent', default: 'parent')

### Teacher
- `name`: String (required)
- `subject`: String (required)
- `email`: String (required, unique)

### Attendance
- `teacher`: ObjectId (ref: Teacher, required)
- `date`: Date (required)
- `status`: String (enum: 'Present', 'Absent', required)

### Report
- `parent`: ObjectId (ref: User, required)
- `teacher`: ObjectId (ref: Teacher, required)
- `issue`: String (required)
- `status`: String (enum: 'Pending', 'Resolved', default: 'Pending')

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "message": "Error description"
}
```

Or for validation errors:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

## Development

- Use `npm run dev` for development with nodemon
- Use `npm start` for production
- All routes include input validation using express-validator
- Passwords are hashed using bcryptjs
- MongoDB connections are handled with Mongoose