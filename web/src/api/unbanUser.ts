import getAccessToken from './getAccessToken'
import http from './http'

async function unbanUser(id: string) {
    const { data } = await http.post(
        `/users/${id}/unban`,
        {},
        {
            headers: {
                Authorization: `Bearer: ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default unbanUser
