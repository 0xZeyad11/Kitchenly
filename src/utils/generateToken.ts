import crypto from 'crypto';

export const GeneratePasswordResetToken  = (): [token: string , encrypted: string]=> {
    const reset_token = crypto.randomBytes(32).toString('hex');
    const encrypted = crypto.createHash('sha256').update(reset_token).digest('hex');
    return [reset_token , encrypted];
}


// export const VerifyUserPasswordResetToken =  async (): Promise<boolean> => {
    
// }