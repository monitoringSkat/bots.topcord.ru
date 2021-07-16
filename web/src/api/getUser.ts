import getAccessToken from './getAccessToken'
import http from './http'

async function getUser(id: string | number) {
    const { data } = await http.get(`/users/${id}`, {
        headers: {
            Authorization: `Bearer: ${getAccessToken()}`
        }
    })
    return data
}

export default getUser
