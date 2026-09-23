import axios, { AxiosInstance } from 'axios'

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    }
})
export default apiClient;
// 스프링부트와 연결