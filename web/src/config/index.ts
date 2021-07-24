const isDev = true // change this

export default {
    SERVER_URL: isDev ? 'http://localhost:5000' : 'https://api-bots.topcord.ru',
    AUTH_LOCAL_STORAGE_KEY: 'auth-topcord-token'
}
