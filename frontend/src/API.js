import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
        // Optional: bypass ngrok warning if testing in browser directly
        'ngrok-skip-browser-warning': 'true'
    }
});

// Interceptor to automatically attach token to future requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('API Request:', config.url, 'Token found:', !!token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * ONLY login function as requested.
 * @param {Object} credentials - e.g., { email: 'user@example.com', password: 'password123' }
 * @returns {Promise} Axios response promise
 */
export const login = async (credentials) => {
    const response = await api.post('/api/users/login/', credentials);

    // Adjust keys if your backend uses 'token' instead of 'access'
    const token = response.data.access || response.data.token;

    if (token) {
        localStorage.setItem('access_token', token);
        if (response.data.role) localStorage.setItem('role', response.data.role);
        if (response.data.full_name) localStorage.setItem('full_name', response.data.full_name);
        if (response.data.email) localStorage.setItem('email', response.data.email);
    }

    return response.data;
};

// =======================
// AUTHENTICATION
// =======================
export const registerUser = async (data) => {
    const response = await api.post('/api/users/register/', data);
    return response.data;
};

export const verifyEmail = async (data) => {
    const response = await api.post('/api/users/verify-email/', data);
    return response.data;
};

// =======================
// PROFILES
// =======================
export const getStudentProfile = async () => {
    const response = await api.get('/api/users/student/profile/');
    return response.data;
};

export const updateStudentProfile = async (data) => {
    const response = await api.put('/api/users/student/profile/', data);
    return response.data;
};

export const getCompanyProfile = async () => {
    const response = await api.get('/api/users/company/profile/');
    return response.data;
};

export const updateCompanyProfile = async (data) => {
    const response = await api.put('/api/users/company/profile/', data);
    return response.data;
};

export const getAdminProfile = async () => {
    const response = await api.get('/api/users/administration/profile/');
    return response.data;
};

export const updateAdminProfile = async (data) => {
    const response = await api.put('/api/users/administration/profile/', data);
    return response.data;
};

export const uploadAvatar = async (formData) => {
    const response = await api.post('/api/users/upload/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const uploadLogo = async (formData) => {
    const response = await api.post('/api/users/upload/logo/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// =======================
// PUBLIC PROFILES
// =======================
export const getPublicStudentProfile = async (studentId) => {
    const response = await api.get(`/api/users/public/student/${studentId}/`);
    return response.data;
};

export const getPublicCompanyProfile = async (companyId) => {
    const response = await api.get(`/api/users/public/company/${companyId}/`);
    return response.data;
};

export const getPublicAdminProfile = async (adminId) => {
    const response = await api.get(`/api/users/public/administration/${adminId}/`);
    return response.data;
};

// =======================
// CV
// =======================
export const saveCV = async (data) => {
    const response = await api.post('/api/users/cv/save/', data);
    return response.data;
};

export const getCV = async () => {
    const response = await api.get('/api/users/cv/');
    return response.data;
};

export const downloadCV = async () => {
    const response = await api.get('/api/users/cv/download/', { responseType: 'blob' });
    return response.data;
};

export const downloadStudentCV = async (studentId) => {
    const response = await api.get(`/api/users/cv/${studentId}/download/`, { responseType: 'blob' });
    return response.data;
};

// =======================
// OFFERS
// =======================
export const getOffers = async () => {
    const response = await api.get('/api/offers/');
    return response.data;
};

export const getMyOffers = async () => {
    const response = await api.get('/api/offers/my-offers/');
    return response.data;
};

export const createOffer = async (data) => {
    const response = await api.post('/api/offers/create/', data);
    return response.data;
};

export const updateOffer = async (offerId, data) => {
    const response = await api.put(`/api/offers/${offerId}/update/`, data);
    return response.data;
};

export const deleteOffer = async (offerId) => {
    const response = await api.delete(`/api/offers/${offerId}/delete/`);
    return response.data;
};

// =======================
// APPLICATIONS
// =======================
export const applyToOffer = async (offerId, data = {}) => {
    const response = await api.post(`/api/applications/apply/${offerId}/`, data);
    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get('/api/applications/my/');
    return response.data;
};

export const getCompanyApplications = async () => {
    const response = await api.get('/api/applications/company/');
    return response.data;
};

export const updateApplicationDecision = async (appId, data) => {
    const response = await api.put(`/api/applications/decision/${appId}/`, data);
    return response.data;
};

export const getPendingApplications = async () => {
    const response = await api.get('/api/applications/pending/');
    return response.data;
};

export const validateApplication = async (appId, data) => {
    const response = await api.put(`/api/applications/validate/${appId}/`, data);
    return response.data;
};

export const downloadApplication = async (appId) => {
    const response = await api.get(`/api/applications/download/${appId}/`, { responseType: 'blob' });
    return response.data;
};

export const getApplicationStats = async () => {
    const response = await api.get('/api/applications/statistics/');
    return response.data;
};

// =======================
// NOTIFICATIONS
// =======================
export const getNotifications = async () => {
    const response = await api.get('/api/notifications/');
    return response.data;
};

export const getUnreadNotifications = async () => {
    const response = await api.get('/api/notifications/unread/');
    return response.data;
};

export const markNotificationRead = async (notifId) => {
    const response = await api.put(`/api/notifications/${notifId}/read/`);
    return response.data;
};

// =======================
// FOLLOWS
// =======================
export const followCompany = async (companyId) => {
    const response = await api.post(`/api/follows/follow/${companyId}/`);
    return response.data;
};

export const unfollowCompany = async (companyId) => {
    const response = await api.delete(`/api/follows/unfollow/${companyId}/`);
    return response.data;
};

export const checkFollowStatus = async (companyId) => {
    const response = await api.get(`/api/follows/check/${companyId}/`);
    return response.data;
};

export const getFollowing = async () => {
    const response = await api.get('/api/follows/following/');
    return response.data;
};

// =======================
// CHATS
// =======================
export const sendMessage = async (appId, data) => {
    const response = await api.post(`/api/chats/send/${appId}/`, data);
    return response.data;
};

export const getChat = async (appId) => {
    const response = await api.get(`/api/chats/${appId}/`);
    return response.data;
};

export const getConversations = async () => {
    const response = await api.get('/api/chats/conversations/');
    return response.data;
};

export const markMessageRead = async (msgId) => {
    const response = await api.put(`/api/chats/${msgId}/read/`);
    return response.data;
};

export default api;