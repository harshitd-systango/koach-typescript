import { Context } from 'koa'
import logger from '../../logger'
import httpConstant from '../constant/httpConstants'
import httpMessage from '../constant/httpMessages'
import userService from '../service/UserService'
import { UserModel } from '../model/User'
import httpConstants from '../constant/httpConstants'
import userValidator from '../validation/UserValidator'
import { preCondition }  from '../utils/userValidate'

class UserController {
    constructor() { }
    async createUser(ctx: Context) {
        try {
            let validation: boolean = await userValidator.createUser(ctx)
            if (!validation) { return }

            logger.info(`Controller : createUser, Request-Body : ${JSON.stringify(ctx.request.body)}`)
            await userService.createUser(ctx)
            ctx.status = httpConstant.HTTP_CREATED
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : createUser, Error : ${JSON.stringify(err)}`)
        }
    }
    async emailVerify(ctx: Context) {
        try {
            await userService.emailVerify(ctx)
            ctx.status = httpConstant.HTTP_SUCCESS_OK
            ctx.body = httpMessage.EMAIL_VERIFICATION_SUCCESS
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : searchUser, Error : ${JSON.stringify(err)}`)
        }
    }
    async searchUser(ctx: Context) {
        try {
            let validation: boolean = await userValidator.searchUser(ctx)
            if (!validation) { return }

            let users: Array<UserModel> = await userService.searchUser(ctx)
            ctx.status = httpConstant.HTTP_SUCCESS_OK
            ctx.body = users
            logger.info(`Controller : searchUser, Response-Body : ${JSON.stringify(ctx.body)}`)
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : searchUser, Error : ${JSON.stringify(err)}`)
        }
    }
    async getUser(ctx: Context) {
        try {
            // let user: any = await userService.getUser(ctx)
            // let user: UserModel = new UserModel()
            let user = await userService.getUser(ctx)
            ctx.body = user
            logger.info(`Controller : getUser, Response-Body : ${JSON.stringify(ctx.body)}`)
            logger.info(`Request-Params : ${JSON.stringify(ctx.params)}`)
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : getUser, Error : ${JSON.stringify(err)}`)
        }
    }
    async updateUser(ctx: Context) {
        try {
            let validation: boolean = await userValidator.updateUser(ctx)
            if (!validation) { return }

            if (!await preCondition(ctx, ctx.state.user._id, ctx.request.body._id)) { return } // condition to check for userID from token and userID from body is same.

            await userService.updateUser(ctx)
            ctx.status = httpConstant.HTTP_SUCCESS_OK
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : getUser, Error : ${JSON.stringify(err)}`)
        }
    }
    async deleteUser(ctx: Context) {
        try {
            let validation: boolean = await userValidator.deleteUser(ctx)
            if (!validation) { return }

            if (!await preCondition(ctx, ctx.state.user._id, ctx.params.user_id)) { return } // condition to check for userID from token and userID from body is same.

            await userService.deleteUser(ctx)
            ctx.status = httpConstant.HTTP_SUCCESS_OK
            ctx.body = httpMessage.DELETE_SUCCESS
            logger.info(`Controller : deleteUser, Request-Params : ${JSON.stringify(ctx.params)}`)
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : deleteUser, Error : ${JSON.stringify(err)}`)
        }
    }
    async forgetPassword(ctx: Context) {
        try {
            let validation: boolean = await userValidator.forgetPassword(ctx)
            if (!validation) { return }

            await userService.forgetPassword(ctx)
        } catch (err) {
            ctx.status = httpConstant.HTTP_INTERNAL_SERVER_ERROR
            ctx.body = { error: err.message }
            logger.error(`Controller : forgetPassword, Error : ${JSON.stringify(err)}`)
        }
    }
    async changePassword(ctx: Context) {
        let validation: boolean = await userValidator.changePassword(ctx)
        if (!validation) { return }

        await userService.changePassword(ctx)
    }
}
const userController: UserController = new UserController()
export default userController 
