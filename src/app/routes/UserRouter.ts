import { RouterManager } from '../core/RouterManager'
import userController from '../controller/UserController'
import ensureUserMiddleware from '../core/middleware/EnsureUser'

const userRouterManager: RouterManager = new RouterManager('/users')

userRouterManager.post('/', userController.createUser)

userRouterManager.patch('/_verify', userController.emailVerify)

userRouterManager.get('/', ensureUserMiddleware.ensureUser, userController.searchUser)

userRouterManager.get('/:user_id', ensureUserMiddleware.ensureUser, userController.getUser)

userRouterManager.put('/', ensureUserMiddleware.ensureUser, userController.updateUser)

userRouterManager.delete('/:user_id', ensureUserMiddleware.ensureUser, userController.deleteUser)

userRouterManager.patch('/_forget-password', userController.forgetPassword)

userRouterManager.patch('/_change-password', ensureUserMiddleware.ensureUser, userController.changePassword)

export default userRouterManager