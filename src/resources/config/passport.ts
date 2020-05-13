import passport from 'koa-passport'
import User, { UserInstance } from '../../app/db/entity/library/user'
import { Strategy } from 'passport-local'
passport.serializeUser((user: any, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id, '-password')
		done(null, user)
	} catch (err) {
		done(err)
	}
})

passport.use('local', new Strategy({
	usernameField: 'username',
	passwordField: 'password'
}, async (username, password, done) => {
	try {
		const user: any = await User.findOne({$or: [{userName: username}, {email: username}]}).where('isVerified').equals(true)
		// const user = await User.findOne({email: username})
		console.log(user)
		if (!user) { 
		return done(null, false) }
		try {
			// const isMatch = true
			const isMatch: any = await user.validatePassword(password)
			console.log(isMatch)
			if (!isMatch) { return done(null, false) }

			done(null, user)
		} catch (err) {
			done(err)
		}
	} catch (err) {
		return done(err)
	}
}))
