import Comment from '../interfaces/comment.interface'
import getAccessToken from './getAccessToken'
import http from './http'

async function editComment(comment: Comment): Promise<boolean> {
    const { data } = await http.put(`/comments/${comment.id}`, comment, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    })
    return data === 'OK'
}

export default editComment
