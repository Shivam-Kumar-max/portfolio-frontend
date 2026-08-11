import axios from 'axios'

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  baseURL: import.meta.env.VITE_API_BASE || 'https://portfolio-backend-m4cl.onrender.com/api',

})

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token is invalid/expired, log the user out and send them to /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
