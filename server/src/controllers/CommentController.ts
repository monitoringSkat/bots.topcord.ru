import { Request, Response } from 'express'

async function getById(req: Request, res: Response) {}

async function getCommentAuthor(req: Request, res: Response) {}

async function create(req: Request, res: Response) {}

async function update(req: Request, res: Response) {}

async function remove(req: Request, res: Response) {}

async function like(req: Request, res: Response) {}

async function dislike(req: Request, res: Response) {}

export default {
    create,
    update,
    remove,
    getById,
    getCommentAuthor,
    like,
    dislike
}
