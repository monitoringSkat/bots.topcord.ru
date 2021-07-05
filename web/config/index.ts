const isDev = process.env.NODE_ENV === "development"

export default {
    SERVER_URL: isDev ? 'http://localhost:5000' : 'https://api-bots.topcord.ru'
}
