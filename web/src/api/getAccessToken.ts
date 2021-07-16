import config from "../config"

function getAccessToken(): string {
    return localStorage.getItem(config.AUTH_LOCAL_STORAGE_KEY) || ""
}

export default getAccessToken