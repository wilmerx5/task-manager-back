import { transport } from "../config/nodemailer";
interface IMail {
    email: string;
    userName: string
    token: string


}

export default {
    verifyAccount: async (field: IMail) => {

        return await transport.sendMail({
            from: 'uptask <admin@uptask.com>',
            to: field.email,
            subject: `${field.userName} verify your account`,
            html:
            `<p> You are close to get your account on uptask just verify your account
            </p>
            <p>Go to the next link</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account"> Confirm Account  </a>
            <p> Write this token <b>${field.token}</b></P>
            `
        })
    },
    forgotPassword: async (field: IMail) => {

        return await transport.sendMail({
            from: 'uptask <admin@uptask.com>',
            to: field.email,
            subject: `${field.userName}  restore password`,
            html:
            `<p> Looks like you forgot your password
            </p>
            <p>Go to the next link to recovered it</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password"> Restore password  </a>
            <p> Write this token <b>${field.token}</b> your token expires in ten minutes</P>
            `
        })
    },

}