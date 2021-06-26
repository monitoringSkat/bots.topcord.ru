import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Bot from "../entities/Bot";
import checkAuth from "../middlewares/checkAuth.middleware";
import findBot from "../middlewares/findBot.middleware";
import getBotAvatarURL from "../utils/get-bot-avatar-url";
import Comment from "../entities/Comment";
import TooManyCommentsPerUserException from "../exceptions/too-many-comments-per-user";
import { verify } from "jsonwebtoken"
import rateLimit from "express-rate-limit"
import User from "../entities/User";
import BotNotFoundException from "../exceptions/bot-not-found.exception";
import Minutes from "../enums/minutes.enum";


const botsRouter = Router();

// GET

/**
 * @swagger
 * /bots:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing   an API.
*/

botsRouter.get("/", async (req, res) => {
  res.send(await Bot.find({ 
    relations: ["owner"], 
    where: {
      verified: true
    } 
  }))

})

botsRouter.get("/:id", 
  [   
    findBot({ 
      relations: ['owner', 'comments', 'comments.author'] 
    }) 
  ], 
  async (req, res) => {
    res.send((req as any).bot);
  }
);


// POST

botsRouter.post(
  "/",
  [
    rateLimit({
      windowMs: Minutes.FIFTEEN,
      max: 100
    }),
    checkAuth,
    body("name").notEmpty().isString(),
    body("id").notEmpty().isString(),
    body("prefix").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("tags").isArray().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.send({ errors: errors.array() })
    const owner = await User.findOne((req.user as any).id)
    const sameBot = await Bot.findOne(req.body.id)
    if (sameBot) return res.send("Same bot!")
    const avatar = await getBotAvatarURL(req.body.id)
    const bot = Bot.create({
        name: req.body.name,
        id: req.body.id,
        prefix: req.body.prefix,
        description: req.body.description,
        tags: req.body.tags,
        supportServerURL: req.body.supportServerURL || null,
        websiteURL: req.body.websiteURL || null,
        githubURL: req.body.githubURL || null,
        inviteURL: req.body.inviteURL || null,
        owner,
        votes: [],
        comments: [],
        avatar: avatar
    })
    await bot.save();

    (req as any).client.emit("create-bot", (req as any).client, bot, owner)
    res.send({ bot })
  }
);


botsRouter.post(
  "/:id/vote", 
  [
    checkAuth,
    rateLimit({
      windowMs: Minutes.FIFTEEN,
      max: 200
    }),
    findBot()
  ], 
  async (req: Request, res: Response) => {
    const bot = (req as any).bot
    const userId = (req.user as any).id
    if (bot.votes.includes(userId)) return res.send( true )
    bot.votes = [...bot.votes, userId]
    await bot.save()
    res.send( true )
  }
)

botsRouter.post(
  "/:id/unvote", 
  [
    rateLimit({
      windowMs: Minutes.FIFTEEN,
      max: 200
    }),
    checkAuth,
    findBot()
  ], 
  async (req: Request, res: Response) => {
    const bot = (req as any).bot
    bot.votes = bot.votes.filter(userId => userId !== "832590237497950309")
    await bot.save()
    res.send( true )
  }
)

botsRouter.post(
  "/:id/comment", 
  [
    rateLimit({
      windowMs: Minutes.FIFTEEN,
      max: 300
    }),
    checkAuth,
    findBot({
      relations: ["comments", "comments.author"]
    }),
    body("text").notEmpty().isString()
  ], 
  (req: Request, res: Response) => {
    const bot = (req as any).bot
    const user = (req as any).user
    const commentsPerUser = bot.comments.filter((comment) => comment.author.id === user.id)
    if (commentsPerUser.length >= 5) return res.send(new TooManyCommentsPerUserException())
    const comment = Comment.create({
      text: req.body.text,
      date: new Date().toLocaleDateString(),
      author: user,
      bot,
    })
    comment.save()
    res.send( comment )
  }
)


botsRouter.post(
  "/:id/guilds", 
  [
    rateLimit({
      windowMs: Minutes.HOUR,
      max: 50 
    }),
    findBot(),
    body("token").isString().notEmpty(),
    body("guilds").isInt().notEmpty()
  ], 
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) res.send( { errors: errors.array() } )
    const { token, guilds } = req.body
    const { botId }: any = verify(token, "secret-key")
    if (!botId) res.send('token is not valid')
    const bot = await Bot.findOne(botId)
    if (!bot) res.send(new BotNotFoundException())
    bot.guildsCount = guilds
    bot.save()
    res.send( 'Done' )
  }
)


// PUT

botsRouter.put(
  "/:id", 
  [
    checkAuth,
    rateLimit({
      windowMs: Minutes.HOUR,
      max: 100
    }),
    body("name").notEmpty().isString(),
    body("id").notEmpty().isString(),
    body("prefix").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("tags").isArray().notEmpty(),
  ], 
  async (req: Request, res: Response) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.send( {errors: errors.array() } )
      await Bot.update({id: req.params.id}, req.body)
      res.send( true )
  }
)


// DELETE

botsRouter.delete(
  "/:id", 
  [
    checkAuth,
    findBot()
  ], 
  (req: Request, res: Response) => {
    const bot = (req as any).bot
    bot.remove()
    res.send( true )
  }
)

export default botsRouter;
