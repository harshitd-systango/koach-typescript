import { Context } from 'koa'
import authService from '../service/AuthService'
import logger from '../../logger'
import httpConstant from '../constant/httpConstants'
import httpMessage from '../constant/httpMessages'
class AuthController {
    constructor() { }
    async authUser(ctx: Context, next) {
        try {
           await authService.authUser(ctx, next)
		   ctx.status = httpConstant.HTTP_SUCCESS_OK
        } catch (err) {
            console.log('err: ', err)
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : loginUser, Error : ${JSON.stringify(err)}`)
        }
    }
}
const authController: AuthController = new AuthController()
export default authController 