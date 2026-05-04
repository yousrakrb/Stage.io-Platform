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

    switch (user.role) {
        case 'Company':
            return <CompanyDashboard />;
        case 'Student':
            return <StudentDashboard />;
        case 'University':
            return <UnivDashboard />;
        default:
            return <div>Invalid Role Detected</div>;
    }
};

export default DashboardWrapper;
