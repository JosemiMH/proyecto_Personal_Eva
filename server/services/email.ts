import nodemailer from "nodemailer";

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // If we have credentials, use them. Otherwise, we'll log to console (mock mode).
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || "gmail", // Default to gmail if not specified
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        } else {
            // Mock transporter
            this.transporter = nodemailer.createTransport({
                jsonTransport: true,
            });
        }
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.log("---------------------------------------------------");
                console.log("📧 [MOCK EMAIL SERVICE] Email would be sent:");
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log(`Text: ${options.text}`);
                console.log("---------------------------------------------------");
                return true;
            }

            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}

export const emailService = new EmailService();
