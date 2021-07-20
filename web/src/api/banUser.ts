import getAccessToken from './getAccessToken'
import http from './http'

async function banUser(id: string) {
    const { data } = await http.post(
        `/users/${id}/ban`,
        {},
        {
            headers: {
                Authorization: `Bearer: ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default banUser
