const API_URL = 'http://localhost:8000'

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || 'Login failed')
    }

    // Save token and user info to localStorage
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    localStorage.setItem('role', data.role)
    localStorage.setItem('full_name', data.full_name)

    return data
}

export const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    localStorage.removeItem('full_name')
}

export const getToken = () => localStorage.getItem('access_token')
export const getRole = () => localStorage.getItem('role')
export const getFullName = () => localStorage.getItem('full_name')