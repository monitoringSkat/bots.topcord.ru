import Comment from '../interfaces/comment.interface'
import getAccessToken from './getAccessToken'
import http from './http'

async function likeComment(comment: Comment, botId: string) {
    const { data } = await http.put(
        `/bots/${botId}/comments/${comment.id}/like`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default likeComment
