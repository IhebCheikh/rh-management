// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeDashboard from './components/EmployeeDashboard';
import HRDashboard from './components/HRDashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import EmployeeLeave from "./components/EmployeeLeave";
import HRLeave from "./components/HRLeave";
import HRPerformance from "./components/HRPerformance";
import EmployeePerformance from "./components/EmployeePerformance";
import HRTimeSheet from "./components/HRTimeSheet";
import EmployeeTimeSheet from "./components/EmployeeTimeSheet";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                    <Route path="/hr-dashboard" element={<HRDashboard />} />
                    <Route path="/employee-leave" element={<EmployeeLeave />} />
                    <Route path="/hr-leave" element={<HRLeave />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/hr/reviews" element={<HRPerformance />} />
                    <Route path="/employee/reviews" element={<EmployeePerformance />} />
                    <Route path="/employee/timesheet" element={<EmployeeTimeSheet />} />
                    <Route path="/hr/timesheet" element={<HRTimeSheet />} />
                    <Route path="/timesheet/:employeeId" element={<HRTimeSheet />} />

                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
