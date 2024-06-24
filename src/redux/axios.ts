import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:4444/",
});

instance.interceptors.request.use((cfg) => {
    if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('token');
        if (token) {
            cfg.headers.authorization = `Bearer ${token}`;
        }
    }
    return cfg;
}, (error) => {
    return Promise.reject(error);
});

export default instance;