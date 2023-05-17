import express, { Application } from 'express'
import cors from 'cors'
import 'reflect-metadata'
import "./decorators/handleRequest.decorator"
import { IRouter } from './decorators/handleRequest.decorator'
import loadControllers from './controllers'
import MetadataKeys from './constants/MetadataKeys.enum'

export default class App {

    static instance: Application = express()

    private constructor() { }

    public static async init() {
        App.instance.use(cors())
        App.instance.use(express.json())

        const controllers = await loadControllers()

        const routesInfo: Array<{ api: string, handler: string }> = []

        for (const Controller of controllers) {
            const controllerInstance = new Controller()

            const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, Controller) || ''

            const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, Controller) || []

            const expressRouter = express.Router()

            for (const router of routers) {
                const { method, middlewares, handlerPath, handlerName } = router
                middlewares ? expressRouter[method](handlerPath, ...middlewares, controllerInstance[handlerName].bind(controllerInstance)) :
                    expressRouter[method](handlerPath, controllerInstance[handlerName].bind(controllerInstance));
                routesInfo.push({
                    api: `${method.toUpperCase()} ${basePath + handlerPath}`, 
                    handler: `${Controller.name}.${handlerName}`
                })
            }
            
            App.instance.use(basePath, expressRouter)

        }

        console.table(routesInfo)

        App.run()
    }
    public static run() {
        App.instance.listen(process.env.PORT, () => {
            console.log(`Server is listening on PORT ${process.env.PORT}`)
        })
    }
}