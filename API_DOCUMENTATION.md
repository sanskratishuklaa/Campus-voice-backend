# CampusVerse-AI Backend API Documentation

**Base URL**: `http://localhost:5000`

## Authentication

All protected routes require a JWT token sent as a cookie or in the Authorization header.

### Auth Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "faculty" | "admin"
}

Response (201):
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

#### Get Current User Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response (200):
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "message": "Logged out successfully"
}
```

---

## Complaints

### Create Complaint
```
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "low" | "medium" | "high"
}

Response (201):
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "string",
  "status": "pending",
  "userId": "string",
  "createdAt": "date"
}
```

### Get All Complaints (User's Own)
```
GET /api/complaints
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "string",
    "status": "string",
    "createdAt": "date"
  }
]
```

### Get Complaint by ID
```
GET /api/complaints/:id
Authorization: Bearer <token>

Response (200):
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "string",
  "status": "string",
  "userId": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Update Complaint
```
PUT /api/complaints/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "low" | "medium" | "high"
}

Response (200):
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "string",
  "status": "string"
}
```

### Delete Complaint
```
DELETE /api/complaints/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Complaint deleted successfully"
}
```

---

## Notifications

### Get User Notifications
```
GET /api/notifications
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "string",
    "userId": "string",
    "message": "string",
    "type": "string",
    "read": boolean,
    "createdAt": "date"
  }
]
```

### Mark Notification as Read
```
PATCH /api/notifications/:id/read
Authorization: Bearer <token>

Response (200):
{
  "_id": "string",
  "read": true
}
```

### Delete Notification
```
DELETE /api/notifications/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Notification deleted successfully"
}
```

---

## Queue Management

### Get Queue Status
```
GET /api/queue
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "string",
    "complaintId": "string",
    "position": number,
    "estimatedTime": "string",
    "status": "string",
    "createdAt": "date"
  }
]
```

### Add to Queue
```
POST /api/queue
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "complaintId": "string"
}

Response (201):
{
  "_id": "string",
  "complaintId": "string",
  "position": number,
  "status": "waiting"
}
```

---

## Admin Routes

### Get All Complaints (Admin)
```
GET /api/admin/complaints
Authorization: Bearer <token>
Role: admin | faculty

Response (200):
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "string",
    "status": "string",
    "userId": {
      "name": "string",
      "email": "string"
    },
    "createdAt": "date"
  }
]
```

### Update Complaint Status (Admin)
```
PATCH /api/admin/complaints/:id/status
Authorization: Bearer <token>
Role: admin | faculty
Content-Type: application/json

Request Body:
{
  "status": "pending" | "in-progress" | "resolved" | "rejected"
}

Response (200):
{
  "_id": "string",
  "status": "string"
}
```

### Get All Users (Admin)
```
GET /api/admin/users
Authorization: Bearer <token>
Role: admin

Response (200):
[
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "createdAt": "date"
  }
]
```

### Get Analytics (Admin)
```
GET /api/admin/analytics
Authorization: Bearer <token>
Role: admin | faculty

Response (200):
{
  "totalComplaints": number,
  "pendingComplaints": number,
  "resolvedComplaints": number,
  "averageResolutionTime": number,
  "complaintsByCategory": {},
  "complaintsByPriority": {}
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, token missing or invalid"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin/Faculty only."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## Frontend Integration Tips

### 1. Authentication Setup

#### Storing JWT Token
```javascript
// After successful login/register
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({ email, password })
});

const data = await response.json();
// Store token in localStorage or use cookies
localStorage.setItem('token', data.token);
```

#### Making Authenticated Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/complaints', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});
```

### 2. Axios Setup (Recommended)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. React Context Example

```javascript
// authContext.js
import { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/auth/profile')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. Environment Variables

Create a `.env` file in your frontend project:
```
REACT_APP_API_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000
```

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)
- `http://localhost:4200` (Angular)

To add more origins, update the `FRONTEND_URL` in `.env`:
```
FRONTEND_URL=http://localhost:3000,https://yourdomain.com
```
