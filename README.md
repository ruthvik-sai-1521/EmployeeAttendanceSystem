Employee Attendance Management System (WorkTrackPro)

A full-stack MERN application designed to streamline employee attendance tracking. It features role-based access control (RBAC) for Employees and Managers, offering real-time check-in/out functionality, attendance reports, and statistical dashboards.

🚀 Tech Stack
Frontend:
React.js (Vite): Fast, component-based UI.
Redux Toolkit: State management for Authentication and Attendance data.
Tailwind CSS: Modern, responsive styling.
Chart.js: Visual data representation for managers.
React-Calendar: Interactive attendance history view.

Backend:
Node.js & Express: RESTful API architecture.
MongoDB & Mongoose: NoSQL database for flexible data storage.
JWT (JSON Web Tokens): Secure authentication.
Moment.js: Date and time manipulation.

✨ Features
👨‍💻 Employee FeaturesSecure 
Login/Register: Create an account with Department and Employee ID.
Mark Attendance: Real-time Check In and Check Out with time calculation.
Live Timings: View shift timings (10:00 AM start) and "Late" status indicators.
Dashboard: View daily status, total hours, and monthly stats.
Calendar History: Visual calendar showing Present (Green), Late (Yellow), and Absent (Red) days.
Profile: View personal details and system role.

👔 Manager 
FeaturesTeam 
Dashboard: View all employees and their "Live" status for today (Present/Late/Not Checked In).
Analytics: Bar charts for Department-wise attendance and Weekly trends.
Search & Filter: Search employees by Name or ID instantly.
Reports: Generate attendance reports by Date Range.
Export: Download attendance reports as CSV files.

📂 Folder Structure
EmployeeAttendanceSystem/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Navbar, UI Components
│   │   ├── features/       # Redux Slices (Auth, Attendance)
│   │   ├── pages/          # Login, Register, Dashboard, Reports, Profile
│   │   ├── App.jsx         # Routing
│   │   └── main.jsx        # Entry point
│   └── package.json
├── server/                 # Node.js Backend
│   ├── config/             # DB Connection
│   ├── controllers/        # Logic (Auth, Attendance)
│   ├── middleware/         # Auth Protection (JWT)
│   ├── models/             # Mongoose Schemas (User, Attendance)
│   ├── routes/             # API Routes
│   ├── .env                # Environment Variables
│   ├── seeder.js           # Script to add Admin user
│   └── server.js           # Server Entry point
└── README.md

🛠️ Setup & Installation
Follow these steps to run the project locally.
1. Prerequisites
    Node.js installed.
    MongoDB installed and running locally (or a Cloud Atlas URI).
2. Clone the Repository
        clone <repository-url>
        cd EmployeeAttendanceSystem
3. Backend Setup
    Navigate to the server folder and install dependencies:
        cd server
        npm install
    Create a .env file in the server folder with the following contents:Code snippetPORT=5000
        MONGO_URI=mongodb://127.0.0.1:27017/attendance_db
        JWT_SECRET=mysecretkey123
    Seed the Database (Create Admin/Test Users):This script clears the database and creates a Manager and an Employee account.
        node seeder.js
    Start the Server:
        npm run dev
    The server should run on http://localhost:5000.
4. Frontend SetupOpen a new terminal, navigate to the client folder, and install dependencies:
    cd ../client
        npm install
    Start the React App:
        npm run dev
    The frontend should run on http://localhost:5173.
    
🔑 Login Credentials (Seed Data)Use these accounts to test the application immediately after running node seeder.js.
Role,       Email,              Password
Manager,    admin@test.com,     password123
Employee,   john@test.com,      password123

📡 API Endpoints
Authentication
    POST /api/auth/register - Register a new employee.
    POST /api/auth/login - Login and receive JWT.
Attendance (Employee)  
    POST /api/attendance/checkin - Mark attendance for today.
    POST /api/attendance/checkout - Mark check-out time.
    GET /api/attendance/my-history - Get logged-in user's history.
Attendance (Manager)
    GET /api/attendance/today-all - Get status of all employees for today.
    POST /api/attendance/report - Get attendance records by Date Range.

📸 Screenshots
Working screenshots are uploaded in a separete folder and .csv file contains employees data exported from application.

🔗 Live Demo: https://attendance-frontend-rose-beta.vercel.app/