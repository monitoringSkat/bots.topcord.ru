import http from "./http"

async function getBot(id: string) {
    const { data } = await http.get(`/bots/${id}`)
    return data
}

export default getBot