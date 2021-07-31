import axios from 'axios'
import config from '../config'

const http = axios.create({
    baseURL: config.SERVER_URL,
})

export default http
