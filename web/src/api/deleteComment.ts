import Comment from '../interfaces/comment.interface'
import getAccessToken from './getAccessToken'
import http from './http'

async function deleteComment(comment: Comment, botId: string) {
    const { data } = await http.delete(
        `/bots/${botId}/comments/${comment.id}`,
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default deleteComment
