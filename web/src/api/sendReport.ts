import getAccessToken from './getAccessToken'
import http from './http'

async function sendReport(botid: string, message: string): Promise<boolean> {
    const { data } = await http.post(
        `/bots/${botid}/report`,
        { message },
        {
            headers: {
                Authorization: `Bearer: ${getAccessToken()}`
            }
        }
    )
    return data === 'OK'
}

export default sendReport
