import passport from 'koa-passport'
import { Context } from 'koa'

class AuthController {
    constructor() { }
    async authUser(ctx: Context, next)
    {
        return passport.authenticate('local', (err, user) => {
			if (err || !user) {
				console.log(user, err)
				ctx.throw(401)
			}
			const token = user.generateToken()
			const response = user.toJSON()
			ctx.append('Authorization', token);
		})(ctx, next)
    }
}

const authController: AuthController = new AuthController()
export default authController