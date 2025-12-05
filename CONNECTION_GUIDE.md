# Frontend-Backend Connection Guide

This guide explains how to connect the React frontend to the Express/MongoDB backend.

## Prerequisites

- Node.js installed
- MongoDB running locally or MongoDB Atlas account
- Both frontend and backend folders set up

## Step-by-Step Setup

### 1. Backend Setup

#### 1.1 Navigate to backend folder
```bash
cd backend
```

#### 1.2 Install dependencies
```bash
npm install
```

#### 1.3 Create `.env` file
Create a `.env` file in the `backend` folder with:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/devordie
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=1d
REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devordie
```

#### 1.4 Start MongoDB
**Local MongoDB:**
- Make sure MongoDB is running on your system
- Default port: `27017`

**MongoDB Atlas:**
- Use the connection string from your Atlas dashboard

#### 1.5 Start backend server
```bash
npm run dev
```

You should see:
- "Mongo connected"
- "API running on port 4000"

### 2. Frontend Setup

#### 2.1 Navigate to frontend folder
```bash
cd front
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Create `.env` file
Create a `.env` file in the `front` folder with:

```env
VITE_API_URL=http://localhost:4000
```

#### 2.4 Start frontend development server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Testing the Connection

#### 3.1 Check backend health
Open browser or use curl:
```
http://localhost:4000/health
```

Should return: `{"status":"ok"}`

#### 3.2 Test frontend connection
1. Open `http://localhost:3000`
2. Try to login (you'll need to register first or use existing credentials)
3. Check browser console for any API errors

### 4. API Endpoints

The backend provides these endpoints:

**Auth:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

**Issues:**
- `GET /issues` - Get all issues (with filters)
- `POST /issues` - Create issue
- `GET /issues/:id` - Get issue by ID
- `PATCH /issues/:id` - Update issue
- `DELETE /issues/:id` - Delete issue
- `POST /issues/:id/status` - Update status
- `POST /issues/:id/assign` - Assign engineer
- `POST /issues/:id/unassign` - Unassign engineer
- `GET /issues/:id/status-history` - Get status history
- `POST /issues/bulk` - Bulk update issues

**Comments:**
- `GET /comments/issue/:issueId` - Get comments for issue
- `POST /comments/issue/:issueId` - Add comment
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

**Attachments:**
- `GET /attachments/issue/:issueId` - Get attachments for issue
- `POST /attachments/issue/:issueId` - Upload attachment
- `DELETE /attachments/:id` - Delete attachment

**Users:**
- `GET /users` - Get all users (admin only)
- `GET /users/engineers` - Get engineers with workload

### 5. Troubleshooting

#### Backend not connecting to MongoDB
- Check MongoDB is running: `mongosh` or check MongoDB service
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB logs for connection errors

#### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Default: `http://localhost:3000`

#### API calls failing
- Check backend is running on port 4000
- Verify `VITE_API_URL` in frontend `.env` matches backend URL
- Check browser console for error messages
- Check backend terminal for error logs

#### Authentication issues
- Clear browser localStorage: `localStorage.clear()`
- Check tokens are being stored: `localStorage.getItem('accessToken')`
- Verify JWT secrets in backend `.env`

### 6. Development Workflow

1. **Start MongoDB** (if local)
2. **Start backend**: `cd backend && npm run dev`
3. **Start frontend**: `cd front && npm run dev`
4. **Open browser**: `http://localhost:3000`

### 7. Production Setup

For production:
- Update `MONGO_URI` to production database
- Set strong `JWT_SECRET` and `REFRESH_SECRET`
- Update `FRONTEND_URL` to production frontend URL
- Update `VITE_API_URL` to production backend URL
- Enable HTTPS
- Set up proper CORS origins
- Use environment-specific configurations

## File Structure

```
devordie/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, validation, roles
│   │   ├── utils/             # JWT, hashing utilities
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── .env                   # Backend environment variables
│   └── package.json
│
└── front/
    ├── src/
    │   ├── services/
    │   │   └── api.js          # API service (axios)
    │   ├── context/
    │   │   ├── AuthContext.jsx # Auth state management
    │   │   └── IssueContext.jsx # Issues state management
    │   └── ...
    ├── .env                   # Frontend environment variables
    └── package.json
```

## Next Steps

1. Register a user via `/auth/register` or use the login page
2. Create issues and test the full workflow
3. Test all CRUD operations
4. Verify file uploads work
5. Test authentication and authorization

