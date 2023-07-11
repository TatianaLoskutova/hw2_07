import {emailAdapter} from '../adapters/email_adapter';


export const emailManager = {
    async sendEmailRecoveryMessage(user: any) {
        // save to repo
        // get user from repo
        await emailAdapter.sendEmail('user.email', 'password recovery',
            '<div>${user.recoveryCode}message</div>')
    }
}