import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator";
import { GET } from "../decorators/handleRequest.decorator";
import UserService from "../services/user.service";

@Controller("/api/users")
export default class UserController {
    private userService = new UserService()

    @GET('/')
    public async getUsers(req: Request, res: Response) {
        return this.userService.getUsers(req, res)
    }    
}