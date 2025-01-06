import axios from 'axios'

export const currentUser = JSON.parse(localStorage.getItem('currentUser'))

const logout = () => {
    // remove user from local storage to log user out
    console.log('Logging out')
    localStorage.removeItem('token')
    AxiosWithAuth.delete('/logout')
    console.log('logged out')
}

const configuredAxios = () => {
    const configured = axios.create({
        baseURL: process.env.REACT_APP_API_ROOT,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    configured.interceptors.response.use(
        res => res, // can run code on every response here in the future
        error => {
            if (error.response.status === 401) {
                logout()
            }
            return Promise.reject(error)
        }
    )
    return configured
}

export const AxiosWithAuth = configuredAxios()

export const authenticationService = {
    logout,
    AxiosWithAuth
}