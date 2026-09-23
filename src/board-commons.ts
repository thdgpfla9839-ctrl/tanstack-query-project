import axios, { AxiosInstance } from 'axios'
// NodeJS => 임의로 포트
const boardClient = axios.create({
    baseURL: "http://localhost:3355",
    headers: {
        "Content-Type": "application/json"
    }
})
export default boardClient
// 노드js와 연결이 될 파일
// 포트번호는 우리가 임의로 설정이 가능하다