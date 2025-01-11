import axios from 'axios'

export const currentUser = JSON.parse(localStorage.getItem('currentUser'))

export const logout = () => {
    console.log('Logging out')
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    window.location.reload()
    console.log('logged out')
}

const configuredAxios = () => {
    const configured = axios.create({
        baseURL: process.env.REACT_APP_API_ROOT,
        headers: {
            Accept: 'application/json',
        },
    });

    // Add a request interceptor to dynamically set the Authorization header
    configured.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token'); // Get the token dynamically
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add a response interceptor to handle errors
    configured.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                logout();
            }
            return Promise.reject(error);
        }
    );

    return configured;
};

export const AxiosWithAuth = configuredAxios()

export const authenticationService = {
    logout,
    AxiosWithAuth
}