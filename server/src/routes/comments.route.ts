import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.middleware";
import rateLimit from "express-rate-limit";
import Minutes from "../enums/minutes.enum";
import Comment from "../entities/Comment";

const commentsRouter = Router()

commentsRouter.delete(
    '/:id',
    [
        checkAuth,
        rateLimit({
            windowMs: Minutes.FIFTEEN,
            max: 300
        })
    ],
    async (req, res) => {
        const comment = await Comment.findOne(req.params.id)
        await comment.remove()
        res.send(200)
    }
)

export default commentsRouter