import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

type DeserializedUser = {
    email: string,
    isBlocked: boolean
}
interface RequestUser extends Request {
    user?: {
        email: string
    }
}

const authMiddleware = async (req: RequestUser, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token)
        return res.status(401).send({ message: 'Unauthorized.' })

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET as string)

    const user = await prisma.user.findUnique({
        where: {
            email: (<DeserializedUser>decodedUser).email
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
    if (!user)
        return res.status(401).send({ message: 'Unauthorized.' })

    if (user.isBlocked)
        return res.status(403).send({ message: 'Account has been blocked.' })

    req.user = user
    next()
}

export default authMiddleware