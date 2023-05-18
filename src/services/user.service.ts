import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

export default class UserService {
    public async getUsers(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isBlocked: true,
                updatedAt: true,
                createdAt: true
            }
        })
        res.status(200).send(users)
    }
    public async getUserById(req: Request, res: Response) {
        const id = +req.params.id
        if(!id) {
            res.status(400)
            throw new Error('Bad request.')
        }
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                email: true,
                role: true,
                isBlocked: true,
                updatedAt: true,
                createdAt: true
            }
        })
        if(!user) {
            res.status(404)
            throw new Error('User not found.')
        }
        res.status(200).send(user)
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
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user) {
            res.status(400)
            throw new Error('Bad credentials.')
        }

        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            res.status(400)
            throw new Error('Bad credentials.')
        }

        const token = jwt.sign({
            id: user.id,
            email
        }, process.env.JWT_SECRET as string)

        res.status(200).send({
            access_token: token
        })
    }
}