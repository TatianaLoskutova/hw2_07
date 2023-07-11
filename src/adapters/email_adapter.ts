import nodemailer from 'nodemailer';


export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tanishasamurai@gmail.com',
                pass: 'lbmubflowrplghpx'
            },
        })
        let result = {
            from: 'Tanisha <tanishasamurai@gmail.com>',
            to: email,
            subject: subject,
            html: message
        };
        return  result
    },
}