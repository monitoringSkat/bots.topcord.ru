import { Router } from "express";
import fs from "fs"

const cats = Router()
const routes = fs.readdirSync(`${__dirname}`).filter(filename => filename.endsWith(`.route.ts`))

routes.forEach(async file => {
    const { url, method, middleware, handle } = (await import(`./${file}`)).default
    cats[method](url, middleware, handle)
})

export default cats