import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator";
import { GET, POST } from "../decorators/handleRequest.decorator";
import UserService from "../services/user.service";
import authMiddleware from "../middlewares/auth.middleware";
import { validateRequestBody } from "zod-express-middleware";
import { z } from 'zod'

@Controller("/api/users")
export default class UserController {
    private userService = new UserService()

    @GET('/', authMiddleware)
    public async getUsers(req: Request, res: Response) {
        return this.userService.getUsers(req, res)
    }

    @GET('/:id', authMiddleware)
    public async getUserById(req: Request, res: Response) {
        return this.userService.getUserById(req, res)
    }

    @POST('/', validateRequestBody(z.object({
        email: z.string().email(),
        password: z.string().min(3).max(32)
    })))
    public async createUser(req: Request, res: Response) {
        return this.userService.createUser(req, res)
    }

    @POST('/login', validateRequestBody(z.object({
        email: z.string().email(),
        password: z.string().min(3).max(32)
    })))
    public async loginUser(req: Request, res: Response) {
        return this.userService.loginUser(req, res)
    }
}