import httpConstants from '../../constant/httpConstants'
import { verify } from 'jsonwebtoken'
import { Context } from "koa"
import envDev from '../../../resources/config/env.development'
import User from '../../db/entity/library/user'
import getTokenObj from '../../utils/getToken'

class EnsureUser {
    constructor () { }

    async ensureUser(ctx: Context, next: any) {
        try {
            const token = getTokenObj.getToken(ctx)
            if (!token) {
                throw new Error()
            }
            let decoded = null
            
            decoded = verify(token, envDev.token)
            /*if (decoded.exp < Math.floor(Date.now() / 1000)) { // exp is expiration of token
                throw new Error()
            }*/
            ctx.state.user = await User.findById(decoded.id, '-password')
            if (!ctx.state.user) {
                throw new Error()
            }
            
            return next()
            
        } catch (error) {
            console.log('error : ', error)
            ctx.status = httpConstants.HTTP_UNAUTHORISED
            ctx.body = { error: { code: 'GEN-UNAUTHORIZED', http_code: 401 } }
            return
        }
    }
}

const ensureUserMiddleware: EnsureUser = new EnsureUser()
export default ensureUserMiddleware
