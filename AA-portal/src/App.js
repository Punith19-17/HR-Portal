import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/user/Home';
import Aboutus from './pages/user/Aboutus';
import Login from './pages/user/Login';
import ALogin from './pages/admin/A_Login';
import Signup from './pages/user/Signup';
import ASignup from './pages/admin/A_Signup';
import Forgotpass from './pages/user/Forgotpass';
import AForgotpass from './pages/admin/A_Forgotpass';
import Dashboard from './pages/user/Dashboard';
import LeaveDashboard from './pages/user/Leave_Dashboard';
import LeaveRequest from './pages/user/Leave_request';
import LeaveHistory from './pages/user/Leave_History';
import Payslip from './pages/user/Payslip';
import Documents from './pages/user/Documents';
import ClubDashboard from './pages/user/Club_Dashboard';
import ClubDetails from './pages/user/Club_Details';
import ADashboard from './pages/admin/A_Dashboard';
import EmployeeInfo from './pages/admin/EmployeeInfo';
import Apersonalinfo from './pages/admin/A_personalinfo';
import Nonteaching from './pages/admin/Nonteaching';
import DepartmentMaster from './pages/admin/DepartmentMaster';
import Qualification from './pages/user/qualification';
import Aqualification from './pages/admin/A_qualification';
import Aservice from './pages/admin/A_service';
import Service from './pages/user/Service';
import Emppass from './pages/user/Emppass';
import Profile from './pages/user/Profile';
import Aleaveapplications from './pages/admin/A_leaveapplications';
import Attendance from './pages/admin/Attendance';
import Aleavestatus from './pages/admin/A_leavestatus';
import Leavestatus from './pages/user/Leavestatus';
import Staffloggeed from './pages/admin/Staffloggeed';
import Aholidays from './pages/admin/A_holidays';
import Staffholidays from './pages/user/Staffholidays';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The root path renders the Aarya Associates Landing Page showing bulletins by default */}
        <Route path="/" element={<Home />} />

        <Route path="/Home" element={<Home />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/A_Login" element={<ALogin />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/A_Signup" element={<ASignup />} />
        <Route path="/Forgotpass" element={<Forgotpass />} />
        <Route path="/A_Forgotpass" element={<AForgotpass />} />

        {/* Staff Dashboard */}
        <Route path="/Dashboard" element={<Dashboard />}>
          {/* Note: Nested routes require the parent to render an <Outlet /> */}
          <Route index element={<h2>Welcome to Staff Dashboard</h2>} /> 
          <Route path="Leave_Dashboard" element={<LeaveDashboard />} />
          <Route path="Leave_request" element={<LeaveRequest />} />
          <Route path="Leave_History" element={<LeaveHistory />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Attendance" element={<Attendance />} />
          <Route path="Payslip" element={<Payslip />} />
          <Route path="Documents" element={<Documents />} />
        </Route>

        {/* Clubs */}
        <Route path="/Club_Dashboard" element={<ClubDashboard />} />
        <Route path="/Club_Details/:id" element={<ClubDetails />} />

        {/* Admin Dashboard & Components */}
        <Route path="/A_Dashboard" element={<ADashboard />} />
        <Route path="/EmployeeInfo" element={<EmployeeInfo />} />
        <Route path="/A_personalinfo" element={<Apersonalinfo />} />
        <Route path="/Nonteaching" element={<Nonteaching />} />
        <Route path="/DepartmentMaster" element={<DepartmentMaster />} />
        <Route path="/Qualification" element={<Qualification />} />
        <Route path="/A_qualification" element={<Aqualification />} />
        <Route path="/A_service" element={<Aservice />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/Emppass" element={<Emppass />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/A_leaveapplications" element={<Aleaveapplications />} />
        <Route path="/A_leavestatus" element={<Aleavestatus />} />
        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/Leavestatus" element={<Leavestatus />} />
        <Route path="/Staffloggeed" element={<Staffloggeed />} />
        <Route path="/A_holidays" element={<Aholidays />} />
        <Route path="/Staffholidays" element={<Staffholidays />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;