import axios from 'axios'
import LocalStorageService from './services/storage/localstorageservice'
import router from './router/router'
const localStorageService = LocalStorageService.getService()

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("userToken")
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        config.headers['Content-Type'] = 'application/json';
        return config
    },
    error => {
        Promise.reject(error)
    }
);

axios.interceptors.response.use(
    response => {
        return response
    },
    async function (error) {
        const originalRequest = error.config

        if (
            error.response.status === 401 &&
            originalRequest.url === 'http://127.0.0.1:3000/v1/auth/token'  // check what is this
        ) {
            router.push('/login')
            return Promise.reject(error)
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refreshToken = localStorageService.getRefreshToken()
            const res = await axios
                .post('/auth/token', {
                    refresh_token: refreshToken
                });
            if (res.status === 201) {
                localStorageService.setToken(res.data);
                axios.defaults.headers.common['Authorization'] =
                    'Bearer ' + localStorageService.getAccessToken();
                return axios(originalRequest);
            }
        }
        return Promise.reject(error)
    }
)