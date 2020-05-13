import mongoose, { Schema, Document } from 'mongoose'
export interface UserVerifyInstance extends Document {
   verifyToken: string,
   userId: string,
   expireIn: Date
}

const VerifyUserSchema: Schema = new Schema({
	verifyToken: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	expireIn: { type: Date, default: Date.now, expires: '24h' }
},
{ timestamps: true })

export default mongoose.model<UserVerifyInstance>('VerifyUser',VerifyUserSchema)