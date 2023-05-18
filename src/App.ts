import express, { Application } from 'express'
import cors from 'cors'
import 'reflect-metadata'
import "./decorators/handleRequest.decorator"
import asyncHandler from "express-async-handler"
import { IRouter } from './decorators/handleRequest.decorator'
import loadControllers from './controllers'
import MetadataKeys from './constants/MetadataKeys.enum'
import errorHandler from './utils/errorHandler'
import morgan from 'morgan'

export default class App {

    static instance: Application = express()

    private constructor() { }

    public static async init() {
        App.instance.use(cors())
        App.instance.use(express.json())
        App.instance.use(morgan('dev'))
        const controllers = await loadControllers()

        const routesInfo: Array<{ api: string, handler: string }> = []

        for (const Controller of controllers) {
            const controllerInstance = new Controller()

            const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, Controller) || ''

            const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, Controller) || []

            const expressRouter = express.Router()

            for (const router of routers) {
                const { method, middlewares, handlerPath, handlerName } = router
                middlewares?.length ? expressRouter[method](handlerPath, ...middlewares, asyncHandler(controllerInstance[handlerName].bind(controllerInstance))) :
                    expressRouter[method](handlerPath, asyncHandler(controllerInstance[handlerName].bind(controllerInstance)));
                
                routesInfo.push({
                    api: `${method.toUpperCase()} ${basePath + handlerPath}`, 
                    handler: `${Controller.name}.${handlerName}`
                })
            }
            
            App.instance.use(basePath, expressRouter)
        }

        App.instance.use(errorHandler)

        console.table(routesInfo)

        App.run()
    }
    public static run() {
        const PORT = process.env.PORT || 1337
        App.instance.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}`)
        })
    }
}