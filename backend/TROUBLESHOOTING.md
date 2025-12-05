# Troubleshooting Registration Issues

## Problem: Data not saving to database during signup

### Step 1: Check Database Connection

1. **Check backend terminal** - Look for:
   - "Mongo connected" message
   - Any MongoDB connection errors

2. **Test database connection**:
   ```bash
   curl http://localhost:4000/health
   ```
   Should return: `{"status":"ok","db":"connected","dbState":1}`

3. **If dbState is not 1**, check:
   - MongoDB is running: `mongosh` or check MongoDB service
   - `MONGO_URI` in `.env` is correct
   - MongoDB connection string format

### Step 2: Check Backend Logs

When you try to sign up, check the backend terminal for:
- "Registration attempt:" log
- "Password hashed, creating user..." log
- "User created successfully:" log
- Any error messages

### Step 3: Check Frontend Console

Open browser DevTools (F12) and check:
- Network tab - Look for `/auth/register` request
- Check response status and body
- Console tab - Look for any errors

### Step 4: Verify MongoDB

1. **Connect to MongoDB**:
   ```bash
   mongosh
   # or
   mongosh "mongodb://localhost:27017/devordie"
   ```

2. **Check if database exists**:
   ```javascript
   show dbs
   use devordie
   show collections
   ```

3. **Check users collection**:
   ```javascript
   db.users.find()
   ```

### Step 5: Common Issues

#### Issue: MongoDB not running
**Solution**: Start MongoDB service
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

#### Issue: Wrong MONGO_URI
**Solution**: Check `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/devordie
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/devordie
```

#### Issue: Database connection timeout
**Solution**: Check firewall and MongoDB port (default: 27017)

#### Issue: Validation errors
**Solution**: Check backend logs for validation error details

#### Issue: Duplicate email
**Solution**: Try with a different email address

### Step 6: Test Registration Manually

Use curl or Postman to test:
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "ranger"
  }'
```

### Step 7: Check User Model

Verify the User model schema matches:
- name (required)
- email (required, unique)
- passwordHash (required)
- role (enum: ranger, engineer, admin, super_admin)

### Debugging Commands

**Check backend logs**:
```bash
cd backend
npm run dev
# Watch for registration logs
```

**Check MongoDB directly**:
```bash
mongosh devordie
db.users.find().pretty()
```

**Test API endpoint**:
```bash
# Health check
curl http://localhost:4000/health

# Register test
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"ranger"}'
```

### Still Not Working?

1. **Check backend terminal** for full error stack trace
2. **Check browser Network tab** for API response
3. **Verify MongoDB is accessible** from your machine
4. **Check `.env` file** has correct values
5. **Restart backend server** after changing `.env`

