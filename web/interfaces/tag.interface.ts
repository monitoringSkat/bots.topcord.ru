import Bot from "./bot.interface";

interface Tag { 
    id: number 
    name: string 
    bots?: Bot[]
}

export default Tag