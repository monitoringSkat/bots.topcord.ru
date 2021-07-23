import Comment from '../interfaces/comment.interface'
import getAccessToken from './getAccessToken'
import http from './http'

async function editComment(comment: Comment, botId: string): Promise<boolean> {
    const { data } = await http.put(
        `/bots/${botId}/comments/${comment.id}`,
        comment,
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default editComment
