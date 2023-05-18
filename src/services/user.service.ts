import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

export default class UserService {
    public async getUsers(req: Request, res: Response) {
        const users = await prisma.user.findMany({})
        res.status(200).send(users)
    }
    public async getUserById(req: Request, res: Response) {
        res.status(200).send({ userId: req.params.id })
    }
    public async createUser(req: Request, res: Response) {
        const { email, password } = req.body
        const hash = await bcrypt.hash(password, SALT_ROUNDS)

        const user = await prisma.user.create({
            data: {
                email,
                password: hash
            },
            select: {
                id: true,
                email: true
            }
        })

        res.status(201).send(user)
    }
    public async loginUser(req: Request, res: Response) {
        
    }
}