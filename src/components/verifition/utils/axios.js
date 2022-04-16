import axios from 'axios';

axios.defaults.baseURL = process.env.BASE_API;

const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  },
})
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    return res
  },
  error => {
  }
)
export default service
