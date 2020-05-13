import { RouterManager } from '../core/RouterManager'
import authController from '../controller/AuthController'

const authRouterManager: RouterManager = new RouterManager('/auth')

authRouterManager.post('/', authController.authUser)

export default authRouterManager