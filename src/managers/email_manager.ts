import {emailAdapter} from '../adapters/email_adapter';


export const emailManager = {
    async sendEmailRecoveryMessage(user: any) {
        // save to repo
        // get user from repo
        await emailAdapter.sendEmail('user.email', 'password recovery',
            '<div>${user.recoveryCode}message</div>')
    },
    async sendEmailConfirmationMessage(user:any) {
        const confirmationLink = 'https://somesite.com/confirm-email?code=your_confirmation_code'
        const emailBody = `
            <h1>Thank you for your registration</h1>
        <p>To finish registration, please follow the link below:</p>
        <p><a href="${confirmationLink}">Complete registration</a></p>`

        await emailAdapter.sendEmail('user.email', 'confirmation', emailBody)
    }
}

