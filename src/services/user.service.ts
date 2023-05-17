import { Request, Response } from "express";

export default class UserService {
    public async getUsers(req: Request, res: Response) {
        res.status(200).send('OK')
    }
}