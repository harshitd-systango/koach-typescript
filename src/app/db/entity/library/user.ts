import config from '../../../../resources/config'
import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export interface UserInstance extends Document {
    firstName: string,
    lastName: string,
    userName: string,
    email : string,
    password: string,
    profilePicUrl?: string,
    bio?: string,
	isVerified?: boolean,
	id?: string
}
const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    userName: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    profilePicUrl: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false}
},
{ timestamps: true })

UserSchema.pre<UserInstance>('save', function preSave (next: any) {
	try {
		const user = this
		if (!user.isModified('password')) {
			return next()
		}
		let salt = bcrypt.genSaltSync(10)
		var hash = bcrypt.hashSync(user.password, salt)
		user.password = hash
		next(null)
	} catch (error) {
		next(error)
	}
})

UserSchema.methods.validatePassword = function validatePassword<UserInstance> (password: string) {
	const user = this
	return new Promise((resolve, reject) => {
		try {
			let isMatch = bcrypt.compareSync(password, user.password)
			resolve(isMatch)
		} catch (error) {
            console.log('error')
			resolve(false)
		}
	})
}

UserSchema.methods.generateToken = function generateToken () {
	const user = this

	return jwt.sign({
		id: user.id
	}, config.token)
}

export default mongoose.model<UserInstance>('User',UserSchema)