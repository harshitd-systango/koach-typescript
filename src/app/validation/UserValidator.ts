import { Context } from 'koa'
import requestValidator from '../core/middleware/RequestValidator'
import httpConstants from '../constant/httpConstants'
import { isBuffer } from 'util';
import Joi from '@hapi/joi'


export class UserValidator {
    constructor() { }

    async createUser(ctx: Context) {
        const reqBodyValidation = Joi.object({
            firstName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
            lastName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
            userName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })

        const reqObj = ctx.request.body
        const { error, value} = await reqBodyValidation.validate(reqObj)
        if (error) {
            ctx.status = httpConstants.HTTP_UNPROCESSABLE_ENTITY
            ctx.body = error
            return false
        }

        return true
    }

    async searchUser(ctx: Context) {
        const reqBodyValidation = Joi.object({
            name: Joi.string().regex(/^[a-zA-Z\s]+$/),
            limit: Joi.number().min(1),
            page: Joi.number().min(1)
        })

        const reqObj = ctx.request.query
        const { error, value } = await reqBodyValidation.validate(reqObj)
        if (error) {
            ctx.status = httpConstants.HTTP_UNPROCESSABLE_ENTITY
            ctx.body = error
            return false
        }

        return true
    }

    async updateUser(ctx: Context) {
        const reqBodyValidation = Joi.object({
            _id: Joi.string().required(),
            firstName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
            lastName: Joi.string().regex(/^[a-zA-Z]+$/).required(),
            userName: Joi.string().required(),
            bio: Joi.string().required()
        })

        const reqObj = ctx.request.body
        const { error, value } = await reqBodyValidation.validate(reqObj)
        if (error) {
            ctx.status = httpConstants.HTTP_UNPROCESSABLE_ENTITY
            ctx.body = error
            return false
        }

        return true
    }

    async deleteUser(ctx: Context) {
        const reqBodyValidation = Joi.object({
            user_id: Joi.string().required()
        })
        
        const reqObj = ctx.params
        const { error, value } = await reqBodyValidation.validate(reqObj)
        if (error) {
            ctx.status = httpConstants.HTTP_UNPROCESSABLE_ENTITY
            ctx.body = error
            return false
        }

        return true
    }

    async forgetPassword(ctx: Context) {
        const reqBodyValidation = Joi.object({
            email: Joi.string().email().required()
        })

        const reqObj = ctx.request.body
        const { error, value } = await reqBodyValidation.validate(reqObj)
        if (error) {
            ctx.status = httpConstants.HTTP_UNPROCESSABLE_ENTITY
            ctx.body = error
            return false
        }

        return true
    }

    async changePassword(ctx: Context) {
        const reqBodyValidation = Joi.object({
            oldPassword: Joi.string().min(6).required(),
            newPassword: Joi.string().min(6).required()
        })

        const reqObj = ctx.request.body
        const { error, value } = await reqBodyValidation.validate(reqObj)
        if (error) {
            ctx.status = httpConstants.HTTP_UNPROCESSABLE_ENTITY
            ctx.body = error
            return false
        }

        return true
    }

}

const userValidator: UserValidator = new UserValidator()

export default userValidator