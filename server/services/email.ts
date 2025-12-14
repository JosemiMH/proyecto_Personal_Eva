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
            // Use service if specified (gmail, outlook, etc.) or custom SMTP
            if (process.env.EMAIL_SERVICE) {
                this.transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_SERVICE,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
            } else {
                // Custom SMTP configuration
                this.transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
            }
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
                console.log(`From: ${process.env.EMAIL_FROM || 'noreply@example.com'}`);
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log(`Text: ${options.text}`);
                console.log("---------------------------------------------------");
                return true;
            }

            const result = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            console.log(`✅ Email sent successfully to ${options.to}`);
            console.log(`Message ID: ${result.messageId}`);
            return true;
        } catch (error) {
            console.error("❌ Error sending email:", error);
            return false;
        }
    }
}

export const emailService = new EmailService();
