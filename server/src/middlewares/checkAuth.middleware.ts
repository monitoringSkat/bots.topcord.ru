import { Request, Response } from "express"
import AuthException from "../exceptions/auth.exception";

function checkAuth(req: Request, res: Response, next: Function) {
    if (req.isAuthenticated()) return next();
    res.send(new AuthException("Unauthorized"))
}

export default checkAuth