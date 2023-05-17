import { Middleware } from "../middlewares/index"
import { RequestMethod } from "../constants/RequestMethod.enum"
import MetadataKeys from "../constants/MetadataKeys.enum"

export interface IRouter {
    method: RequestMethod
    middlewares?: any[]
    handlerPath: string
    handlerName: string
}

const decoratorFactory = (method: RequestMethod) =>
    (path: string, ...middlewares: Middleware[]) => {
        return (target: any, key: any) => {
            const controllerClass = target.constructor

            const routers: IRouter[] = Reflect.hasMetadata(MetadataKeys.ROUTERS, controllerClass) 
                ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
                : []
            
            routers.push({method, middlewares, handlerPath: path, handlerName: key})

            Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass)
        }
    }

export const GET = decoratorFactory(RequestMethod.GET)
export const POST = decoratorFactory(RequestMethod.POST)
export const PUT = decoratorFactory(RequestMethod.PUT)
export const DELETE = decoratorFactory(RequestMethod.DELETE)