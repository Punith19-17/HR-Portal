import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Staff_components/Home';
import Aboutus from './Staff_components/Aboutus';
import Login from './Staff_components/Login';
import ALogin from './admin_components/A_Login';
import Signup from './Staff_components/Signup';
import ASignup from './admin_components/A_Signup';
import Forgotpass from './Staff_components/Forgotpass';
import AForgotpass from './admin_components/A_Forgotpass';
import Dashboard from './Staff_components/Dashboard';
import LeaveDashboard from './Staff_components/Leave_Dashboard';
import LeaveRequest from './Staff_components/Leave_request';
import LeaveHistory from './Staff_components/Leave_History';
import ClubDashboard from './Staff_components/Club_Dashboard';
import ClubDetails from './Staff_components/Club_Details';
import ADashboard from './admin_components/A_Dashboard';
import EmployeeInfo from './admin_components/EmployeeInfo';
import Apersonalinfo from './admin_components/A_personalinfo';
import Nonteaching from './admin_components/Nonteaching';
import DepartmentMaster from './admin_components/DepartmentMaster';
import Qualification from './Staff_components/qualification';
import Aqualification from './admin_components/A_qualification';
import Aservice from './admin_components/A_service';
import Service from './Staff_components/Service';
import Emppass from './Staff_components/Emppass';
import Profile from './Staff_components/Profile';
import Aleaveapplications from './admin_components/A_leaveapplications';
import Attendance from './admin_components/Attendance';
import Aleavestatus from './admin_components/A_leavestatus';
import Leavestatus from './Staff_components/Leavestatus';
import Staffloggeed from './admin_components/Staffloggeed';
import Aholidays from './admin_components/A_holidays';
import Staffholidays from './Staff_components/Staffholidays';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The root path now redirects to the Staff Login page by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Optional: If you want Home to be the initial landing page, 
            you can change the above line back to:
            <Route path="/" element={<Home />} />
        */}

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