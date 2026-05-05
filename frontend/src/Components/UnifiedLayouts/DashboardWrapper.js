import React, { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CompanyDashboard from '../CompanyDash/CompanyDash';
import StudentDashboard from '../StudentDash/StudentDash';
import UnivDashboard from '../UnivDash/UnivDash';

const DashboardWrapper = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/signin');
        }
    }, [user, navigate]);

    if (!user) return null;

    switch (user.role?.toLowerCase()) {
        case 'company':
            return <CompanyDashboard />;
        case 'student':
            return <StudentDashboard />;
        case 'university':
        case 'administration':
            return <UnivDashboard />;
        default:
            return <div>Invalid Role Detected: {user.role}</div>;
    }
};

export default DashboardWrapper;
