import axios from "axios"
import config from "../config"

const http = axios.create({
    baseURL: config.SERVER_URL,
    headers: {
        Authorization: `Bearer: ${localStorage.getItem(config.AUTH_LOCAL_STORAGE_KEY)}`
    }
})

export default http