import Comment from "../interfaces/comment.interface"
import getAccessToken from "./getAccessToken"
import http from "./http"

async function likeComment(comment: Comment) {
    const { data } = await http.put(
        `/comments/${comment.id}/like`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === "OK"
}

export default likeComment