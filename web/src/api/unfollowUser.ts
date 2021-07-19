import getAccessToken from './getAccessToken'
import http from './http'

async function unfollowUser(id?: string) {
    const { data } = await http.post(
        `/users/${id}/unfollow`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default unfollowUser
