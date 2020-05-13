import { Context } from 'koa'
import User, { UserInstance } from '../db/entity/library/user'
import UserVerify, { UserVerifyInstance } from '../db/entity/library/userVerify'
import { UserModel } from '../model/User';
import jwt from 'jsonwebtoken'
import httpConstant from '../constant/httpConstants'
import httpMessage from '../constant/httpMessages'
import constants from '../constant/contants'
import lodash from 'lodash'
import crypto from 'crypto'
import generator from 'generate-password'
import { SendMail }  from '../utils/email'
import mongoose from 'mongoose'
class UserService {
    constructor() { }
    async createUser(ctx: Context) {
        let firstName: string = ctx.request.body.firstName
        let lastName: string = ctx.request.body.lastName
        let userName: string = ctx.request.body.userName
        let email: string = ctx.request.body.email
        let password: string = ctx.request.body.password
        let user: any = new User({
            firstName: firstName,
            lastName: lastName,
            userName:userName,
            email: email,
            password: password
        })
        // adding book into database
        await user.save()
        let randamToken = crypto.randomBytes(16).toString('hex')
        const userVerifyDetail = {
            userId: user._id,
            verifyToken: randamToken
            // expireIn: new Date() + 600000
        }
        const userVerify: any = new UserVerify(userVerifyDetail)
        await userVerify.save()
        let mailtoken = jwt.sign(userVerifyDetail, 'emailtoken')
        let from: string = 'systangoproject@gmail.com'
        let to: string = ctx.request.body.email
        let subject: string = 'Please confirm your Email account'
        let link = 'https://localhost:3000/api/v1/users/_verify?userVerify='+mailtoken
        let html = "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        let result: number = await new SendMail().sendMail(from, to, subject, html)
        if (!result) {
            ctx.status = httpConstant.HTTP_REQUESTED_RESOURCE_NOT_FOUND
            ctx.body = httpMessage.EMAIL_VERIFICATION_SEND_FAIL
        }
    }
    async emailVerify(ctx: Context) {
        const token = ctx.request.query.userVerify
        let getToken = jwt.verify(token, 'emailtoken')
        const userId = getToken.userId
        const verifyToken = getToken.verifyToken
        const checkUserVerify: any = await User.findOne({_id: userId, isVerified: true}) // .where('isVerified').equals(true)
        if (checkUserVerify) {
            ctx.body = httpMessage.VALIDATE_SUCCESS
            ctx.status = httpConstant.HTTP_UNPROCESSABLE_ENTITY
            return
        } //  expireIn: { $gt: Date.now() }
        const tokenVerify: UserVerifyInstance = await UserVerify.findOne({verifyToken: verifyToken, userId: userId})
        if (!tokenVerify) {
            ctx.body = httpMessage.EMAIL_TOKEN_VALIDATE
            ctx.status = httpConstant.HTTP_REQUESTED_RESOURCE_NOT_FOUND
            return
        }
        await User.findOneAndUpdate({_id: userId}, {
            $set: {
                isVerified: true
            }
        })
    }
    async searchUser(ctx: Context) {
        const limit: number = parseInt(ctx.request.query.limit) || constants.DEFAULTS.LIMIT
        const page: number = parseInt(ctx.request.query.page) || 1
        const name = ctx.request.query.name

        if (!name) {
            ctx.body = httpMessage.NOTHING_SEARCHED
            ctx.status = httpConstant.HTTP_BAD_REQUEST
            return
        }
        let userSearch

        if (/\s/.test(name)) {
            const namedata: Array<string> = name.trim().split(/\s+/)
            const firstName: string = namedata[0]
            const lastName: string = namedata[1]
            /*userSearch = await User.find({ $and: [{$or: [{firstName: {$regex: new RegExp(firstName, 'i')}},
                {lastName: {$regex: new RegExp(lastName, 'i')}}]} , {isVerified: true} ]})*/

            userSearch = await User.find({$or: [{firstName: {$regex: new RegExp(firstName, 'i')}},
                {lastName: {$regex: new RegExp(lastName, 'i')}}], isVerified: true})
        } else {
            let searchFirstname = await User.find({firstName: {$regex: new RegExp(name, 'i')}, isVerified: true})
            let searchLastname = await User.find({lastName: {$regex: new RegExp(name, 'i')}, isVerified: true})
            const all: Array<string> = lodash.concat(searchFirstname, searchLastname)
            userSearch = lodash(all).drop((page-1)*limit).take(limit)
        }

        let users: Array<UserModel> = new Array<UserModel>()

        for (let search of userSearch) {
            let user: UserModel = new UserModel()
            delete user.userName
            delete user.email
            delete user.password
            delete user.profilePicUrl
            delete user.bio
            user.setId(search.id)
            user.setFirstName(search.firstName)
            user.setLastName(search.lastName)
            users.push(user)
        }

        return users
    }
    async getUser(ctx: Context) {
        const userId: string = ctx.params.user_id
            // const logedInUser: string = ctx.state.user._id
        const getUserData: UserInstance = await User.findOne({_id: userId})
        if (!getUserData) {
            ctx.body = httpMessage.USER_NOT_FOUND
            ctx.status = httpConstant.HTTP_REQUESTED_RESOURCE_NOT_FOUND
            return
        }

        let user: UserModel = new UserModel()
        delete user.password
        if (getUserData) {
            user.setId(getUserData.id)
            user.setFirstName(getUserData.firstName)
            user.setLastName(getUserData.lastName)
            user.setUserName(getUserData.userName)
            user.setBio(getUserData.bio)
            user.setProfilePicUrl(getUserData.profilePicUrl)
            user.setEmail(getUserData.email)
        }
        return user
    }
    async updateUser(ctx: Context) {
        const user: any = ctx.request.body
        const firstName: string = user.firstName.trim()
        const lastName: string = user.lastName.trim()
        const bio: string = user.bio.trim()
        const userName: string = user.userName.trim()
        // const logedInUser: string = ctx.state.user._id || ctx.params.id
        // const resultcondition = await preCondition(ctx, logedInUser, user._id)
        // if (!resultcondition) {
        //     ctx.body =  httpMessage.CANNOT_UPDATE
        //     return
        // }
        const userdata = await User.findByIdAndUpdate(user._id, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                bio: bio
            }})
    }
    async deleteUser(ctx: Context) {
        const userId: string = ctx.params.user_id
        const logedInUser:string = ctx.state.user._id
        const deleteCheck: boolean = true// await preCondition(ctx, logedInUser, userId)
        if (!deleteCheck) {
            ctx.body = httpMessage.CAN_NOT_DELETE
            return
        }
        await User.findOneAndRemove({_id: userId})
    }
    async forgetPassword(ctx: Context) {
        const email: string = ctx.request.body.email
        let userData: any = await User.findOne({email: email})
        if (userData) {
            let password = generator.generate({
                length: 10,
                numbers: true
            })
            userData.password = password
            await userData.save()
            let from: string = 'systangoproject@gmail.com'
            let to: string = email
            let subject: string = 'Forgot Password'
            let html: string = 'Your new password for your account is: ' + password
            let result = new SendMail().sendMail(from, to, subject, html)
            if (result) {
                ctx.status = httpConstant.HTTP_SUCCESS_OK
                return
            } else {
                ctx.status = httpConstant.HTTP_SUCCESS_OK
                ctx.body = httpMessage.PASSWORD_CHANGED_MAIL_NOT_SEND
                return
            }
        } else {
            ctx.status = httpConstant.HTTP_REQUESTED_RESOURCE_NOT_FOUND
            ctx.body = httpMessage.USER_NOT_FOUND
            return
        }
    }
    async changePassword(ctx: Context) {
        
        let user: any = await User.findOne({
            _id: mongoose.Types.ObjectId(ctx.state.user._id)
        })

        let isMatch = await user.validatePassword(ctx.request.body.oldPassword)
        if (isMatch) {
            user.password = ctx.request.body.newPassword
            user.save()
            ctx.status = httpConstant.HTTP_SUCCESS_OK
            ctx.body = {
                success: true
            }
        } else {
            ctx.body = {
                success: false
            }
            ctx.status = httpConstant.HTTP_UNAUTHORISED
        }
        return
    }
}

let userService: UserService = new UserService()
export default userService