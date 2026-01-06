import axios from 'axios'
const api = axios.create({
    baseURL:"http://10.10.1.200:4000",
    timeout:20000,
    headers:{
        "Content-Type":"application/json"
    }
})
export default api