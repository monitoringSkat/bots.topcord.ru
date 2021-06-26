const whitelist = ["https://dev.topcord.ru", "http://localhost:3000", "http://localhost:5000/" ,"https://api-bots.topcord.ru/"]

function checkOrigin(origin: string): boolean {
    if (whitelist.includes(origin) || origin === undefined) return true
    return false
}

export default checkOrigin