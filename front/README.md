# 🦸 Power Rangers Command Center - Issue Tracker

A modern, Power Rangers-themed issue tracking system built with React. Track teleport pad breakdowns, sensor glitches, zord engine leaks, and more!

![Power Rangers Theme](https://img.shields.io/badge/Theme-Power%20Rangers-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 🎯 Core Features

- **✅ Login & Role-Based Access**
  - Ranger
  - Engineer
  - Admin
  - Super Admin (Zordon)
  - Each role sees different dashboards and permissions

- **✅ Issue Raising System**
  - Submit issues with priority, category, description
  - Timestamp tracking
  - File attachments support
  - Categories: Teleport Pad, Sensor, Zord Engine, etc.

- **✅ Engineer Assignment Workflow**
  - Admins can assign engineers
  - Change assignments
  - Track workload
  - Instant notifications (UI ready)

- **✅ SLA Timers**
  - Automatic SLA deadline tracking
  - Visual indicators for:
    - Upcoming SLA breaches
    - Overdue issues
    - Resolved on time metrics

- **✅ Commenting System**
  - Threaded comments
  - Engineer updates
  - Ranger feedback
  - Troubleshooting communication

- **✅ Status Tracker**
  - Lifecycle: Open → In Progress → On Hold → Resolved → Closed
  - Real-time updates

- **✅ Analytics Dashboard**
  - Total issues
  - SLA performance
  - Engineer productivity
  - Facility health
  - Interactive charts

### ⚡ Advanced Functionalities

- **⭐ Real-time Notifications UI**
  - Socket.IO ready (notification UI implemented)
  - New issue assigned
  - Status changes
  - SLA breach warnings

- **⭐ Multi-Tenancy**
  - Support multiple facilities
  - Different Ranger teams
  - Separate data
  - Super-admin view

- **⭐ Bulk Operations**
  - Update or close multiple issues at once
  - Bulk assignment
  - Bulk status updates

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM 6.20.0** - Routing
- **Tailwind CSS 3.3.6** - Styling
- **Recharts 2.10.3** - Analytics charts
- **React Hot Toast 2.4.1** - Notifications
- **React Icons 4.12.0** - Icons
- **date-fns 2.30.0** - Date formatting
- **Socket.IO Client 4.5.4** - Real-time (ready for backend integration)
- **Axios 1.6.2** - HTTP client (ready for backend)
- **Vite 5.0** - Build tool

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devordie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will open at `http://localhost:3000`

## 👤 Demo Accounts

### Quick Login (Click to login instantly)

#### Rangers
- **Jason Red Ranger**
  - Email: `jason@rangers.com`
  - Password: `ranger123`

- **Kimberly Pink Ranger**
  - Email: `kimberly@rangers.com`
  - Password: `ranger123`

#### Engineers
- **Engineer Sarah**
  - Email: `sarah@engineers.com`
  - Password: `engineer123`

- **Engineer Tom**
  - Email: `tom@engineers.com`
  - Password: `engineer123`

#### Admin
- **Commander Alpha**
  - Email: `admin@command.com`
  - Password: `admin123`

#### Super Admin (Zordon)
- **Zordon**
  - Email: `zordon@command.com`
  - Password: `zordon123`

## 📁 Project Structure

```
devordie/
├── src/
│   ├── components/
│   │   ├── dashboards/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EngineerDashboard.jsx
│   │   │   ├── RangerDashboard.jsx
│   │   │   └── SuperAdminDashboard.jsx
│   │   ├── BulkActions.jsx
│   │   ├── CommentSystem.jsx
│   │   ├── EngineerAssignment.jsx
│   │   ├── Layout.jsx
│   │   ├── SLATimer.jsx
│   │   └── StatusUpdater.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── IssueContext.jsx
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── CreateIssue.jsx
│   │   ├── Dashboard.jsx
│   │   ├── IssueDetail.jsx
│   │   ├── Issues.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Power Rangers Theme

The application features a vibrant Power Rangers color scheme:

- **Ranger Red**: `#E02E24` - Rangers
- **Ranger Blue**: `#0066CC` - Engineers
- **Ranger Green**: `#00CC66` - Admins
- **Zordon Gold**: `#FFA500` - Super Admin
- **Morphin Time Purple**: `#8B00FF` - Accents
- **Ranger Yellow**: `#FFD700` - Warnings

## 🔌 Backend Integration

The frontend is ready for backend integration:

1. **Authentication API**
   - Update `AuthContext.jsx` to use your API endpoints

2. **Issue API**
   - Update `IssueContext.jsx` to fetch from your backend
   - Replace localStorage with API calls

3. **Real-time Notifications**
   - Socket.IO client is already included
   - Connect to your Socket.IO server in `Layout.jsx`

4. **File Uploads**
   - Implement file upload endpoint
   - Update attachment handling in `CreateIssue.jsx`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Key Features in Detail

### Issue Lifecycle

1. **Open** - Newly reported issue
2. **In Progress** - Assigned and being worked on
3. **On Hold** - Temporarily paused
4. **Resolved** - Fixed, awaiting confirmation
5. **Closed** - Confirmed and archived

### Priority Levels

- **Critical** - Immediate attention required (Red)
- **High** - Urgent (Orange)
- **Medium** - Normal priority (Yellow)
- **Low** - Can wait (Green)

### SLA Tracking

- Automatic deadline calculation
- Visual countdown timers
- Overdue highlighting
- Performance metrics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🦸 Power Up!

**"It's Morphin Time!"** - Get ready to track issues like a true Power Ranger!

---

Built with ❤️ and the Power of the Rangers
