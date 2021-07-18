import config from '../config'
import getAccessToken from './getAccessToken'
import http from './http'

async function getUser(id: string | number, token?: string) {
    if (token) localStorage.setItem(config.AUTH_LOCAL_STORAGE_KEY, token)
    const { data } = await http.get(`/users/${id}`, {
        headers: {
            Authorization: `Bearer: ${getAccessToken()}`
        }
    })
    return data.statusCode === 404 ? { user: null } : data
}

export default getUser
