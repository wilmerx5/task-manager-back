import { Request, Response } from 'express'
import AuthEmail from '../emails/AuthEmail'
import { Token } from '../models/Token'
import { User } from '../models/User'
import { hashPassword, verifyPassword } from '../utils/auth'
import { GenerateJWT } from '../utils/jwt'
import { generateSixDigitToken } from '../utils/token'
export default {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ 'msg': "invalid user or password" })
            }
            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateSixDigitToken()
                Promise.allSettled([AuthEmail.verifyAccount({ email: user.email, userName: user.userName, token: token.token })
                    , token.save()])
                return res.status(401).json({ 'msg': "Account not verified yet, will send you an email verification" })
            }

            const passwordMatches = await verifyPassword(user.password, password)
            if (!passwordMatches) {
                return res.status(404).json({ 'msg': "invalid user or password" })
            }
            const payload = {
                id: user.id
            }
            const token = GenerateJWT(payload)
            return res.send(token)

        }
        catch (e) {
            res.status(500).json({ 'error': "server error", "msg": e.message })

        }

    },
    signUp: async (req: Request, res: Response) => {
        try {

            const userExist = await User.findOne({ email: req.body.email })
            if (userExist) {
                return res.status(400).json({ msg: 'user already exist' })
            }
            const user = new User(req.body)
            user.password = await hashPassword(user.password)
            const token = new Token()
            token.token = generateSixDigitToken()
            token.user = user.id

            await AuthEmail.verifyAccount({
                email: user.email,
                userName: user.userName,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send('User created/ verify your account')
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "message": e.message })
        }
    },
    confirmAccount: async (req: Request, res: Response) => {
        try {

            const { token } = req.body
            const isToken = await Token.findOne({ token })
            if (!isToken) {
                return res.status(400).json({ msg: "Wrong token, verify your token" })
            }

            const user = await User.findById(isToken.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), isToken.deleteOne()])

            res.send("account confirmed")

        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "ww": e.message })
        }
    },
    requestConfirmationToken: async (req: Request, res: Response) => {
        try {

            const userExist = await User.findOne({ email: req.body.email })
            if (!userExist) {
                return res.status(404).json({ msg: 'Create an account first' })
            }
            if (userExist.confirmed) {
                return res.status(403).json({ msg: 'account already confirmed' })
            }
            const token = new Token()
            token.token = generateSixDigitToken()
            token.user = userExist.id

            await Promise.allSettled([token.save(), AuthEmail.verifyAccount({
                email: userExist.email,
                userName: userExist.userName,
                token: token.token
            })])
            res.send('TOken send to your email')
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "message": e.message })
        }

    },

    forgotPassword: async (req: Request, res: Response) => {
        try {

            const userExist = await User.findOne({ email: req.body.email })
            if (!userExist) {
                return res.status(404).json({ msg: 'Yo dont have an account, create one' })
            }
            if (!userExist.confirmed) {
                return res.status(403).json({ msg: 'account not confirmed yet' })
            }
            const token = new Token()
            token.token = generateSixDigitToken()
            token.user = userExist.id

            await Promise.allSettled([token.save(), AuthEmail.forgotPassword({
                email: userExist.email,
                userName: userExist.userName,
                token: token.token
            })])
            res.send('Check your email to recover your password')
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "message": e.message })
        }

    },
    validateToken: async (req: Request, res: Response) => {
        try {

            const { token } = req.body
            console.log(token)
            const isToken = await Token.findOne({ token })
            if (!isToken) {
                return res.status(400).json({ msg: "Wrong token, verify your token" })
            }
            res.send("Set your new password")
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "msg": e.message })
        }
    },
    updatePasswordWithToken: async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const isToken = await Token.findOne({ token })
            if (!isToken) {
                return res.status(400).json({ msg: "Wrong token, verify your token" })
            }

            const user = await User.findById(isToken.user)
            user.password = await hashPassword(req.body.password)

            Promise.allSettled([user.save(), isToken.deleteOne()])
            res.send("Password have changed")
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "msg": e.message })
        }
    },

    getUser: async (req: Request, res: Response) => {
        try {
            return res.json(req.user)
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "msg": e.message })
        }
    },

    editProfile: async (req: Request, res: Response) => {
        const { userName, email } = req.body

        const userExist = await User.findOne({ email })

        if (userExist && userExist.id.toString() != req.user.id.toString()) {
            return res.status(409).json({ msg: 'this email is already registered' })
        }

        try {
            req.user.userName = userName
            req.user.email = email

            await req.user.save()
            return res.send('updated profile')
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "msg": e.message })
        }
    },

    updatePasswordCurrentUser: async (req: Request, res: Response) => {
        const { currentPassword, password } = req.body

        const user = await User.findById(req.user.id)

        const isCurrentPasswordRight = await verifyPassword(user.password, currentPassword)

        if (!isCurrentPasswordRight) {
            return res.status(409).json({ msg: 'Your current password doesnt match' })
        }
        user.password = await hashPassword(password)

        try {
            await user.save()
            return res.send('updated user')
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "msg": e.message })
        }
    },


    checkUser: async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user.id)

        const isCurrentPasswordRight = await verifyPassword(user.password, password)

        if (!isCurrentPasswordRight) {
            return res.status(409).json({ msg: 'Your current password doesnt match' })
        }

        try {
            return res.send('ok proceed')
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ 'error': "server error", "msg": e.message })
        }
    },
}