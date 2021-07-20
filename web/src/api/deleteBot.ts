import getAccessToken from "./getAccessToken"
import http from "./http"

async function deleteBot(id: string): Promise<boolean> {
    const { data } = await http.delete(`/bots/${id}`, {
        headers: {
            Authorization: `Bearer: ${getAccessToken()}`
        }
    })
    return data === "OK"
}

export default deleteBot