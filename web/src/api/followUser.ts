import getAccessToken from "./getAccessToken"
import http from "./http"

async function followUser(id?: string) {
    const { data } = await http.post(
        `/users/${id}/follow`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === "OK"
}

export default followUser