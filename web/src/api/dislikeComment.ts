import Comment from '../interfaces/comment.interface'
import getAccessToken from './getAccessToken'
import http from './http'

async function dislikeComment(comment: Comment, botId: string) {
    const { data } = await http.put(
        `/bots/${botId}/comments/${comment.id}/dislike`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default dislikeComment
