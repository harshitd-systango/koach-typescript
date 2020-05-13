import { Context } from "koa"

class getToken {
    constructor () { }
    getToken(ctx: Context):any {
        const header = ctx.request.headers.authorization
        if (!header) {
            return null
        }
        
        const parts = header.split(' ')
        if (parts.length !== 2) {
            return null
        }
        const scheme = parts[0]
        const token = parts[1]
        if (/^Bearer$/i.test(scheme)) {
            return token
        }
        return null
    }
}

const getTokenObj: getToken = new getToken()
export default getTokenObj
