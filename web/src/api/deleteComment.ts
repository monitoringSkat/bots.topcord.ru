import Comment from '../interfaces/comment.interface'
import getAccessToken from './getAccessToken'
import http from './http'

async function deleteComment(comment: Comment) {
    const { data } = await http.delete(`/comments/${comment.id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
    return data === 'OK'
}

export default deleteComment
