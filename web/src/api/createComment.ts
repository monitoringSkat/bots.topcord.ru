import getAccessToken from './getAccessToken'
import http from './http'

interface CreateComment {
    text: string
    rating: number
    botId: string | number
}

async function createComment({ text, rating, botId }: CreateComment) {
    try {
        const { data } = await http.post(
            `/comments`,
            { text, rating, botId },
            {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                }
            }
        )
        return data.statusCode === 503 ? false : data
    } catch (e) {
        console.log(e)
    }
}

export default createComment
