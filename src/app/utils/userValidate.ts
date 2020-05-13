import { Context } from 'koa'
import httpConstant from '../constant/httpConstants'
import httpMessages from '../constant/httpMessages'

export async function preCondition (ctx, currentUser, verifyUserId) {
	const userverify = String(verifyUserId) === String(currentUser)
	if (!userverify) {
		ctx.status = httpConstant.HTTP_UNPROCESSABLE_ENTITY
		ctx.body = httpMessages.NOT_ALLOWED
		return false
	}
	return true
}
