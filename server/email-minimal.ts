/**
 * Minimal email service - logs to console instead of sending emails
 * No SMTP dependencies
 */
export class MinimalEmailService {
    async sendEmail(options: { to: string; subject: string; text: string; html?: string }) {
        console.log('');
        console.log('📧 ================================');
        console.log('📧 EMAIL (Not sent - console only)');
        console.log('📧 ================================');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.text.substring(0, 100)}...`);
        console.log('📧 ================================');
        console.log('');
        return true;
    }
}

export const emailService = new MinimalEmailService();
