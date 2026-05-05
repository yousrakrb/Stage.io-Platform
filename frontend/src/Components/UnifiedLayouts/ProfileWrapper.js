import React, { useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CompanyProfile from '../CompanyProfile/CompanyProfile';
import StudentProfile from '../StudentProfile/StudentProfile';
import UnivProfile from '../UnivProfile/UnivProfile';

const ProfileWrapper = () => {
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
            return <CompanyProfile />;
        case 'student':
            return <StudentProfile />;
        case 'university':
        case 'administration':
            return <UnivProfile />;
        default:
            return <div>Invalid Role Detected: {user.role}</div>;
    }
};

export default ProfileWrapper;
