import {emailManager} from '../../managers/email_manager';


export const authService = {
    async doOperation() {
        // save to repo
        // get user from repo
        await emailManager.sendEmailRecoveryMessage({})
    }
}