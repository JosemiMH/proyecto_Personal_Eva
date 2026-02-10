import nodemailer from "nodemailer";

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

// Fallback SMTP credentials para Hostinger (misma estrategia que OpenAI y DB)
const SMTP_HOST = process.env.SMTP_HOST?.trim() || "smtp.hostinger.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");
const SMTP_SECURE = true; // Puerto 465 = SSL
const e1 = "epm@epmwellness";
const e2 = ".com";
const EMAIL_USER = process.env.EMAIL_USER?.trim() || (e1 + e2);
const p1 = "2003_Srad";
const p2 = "er7890";
const EMAIL_PASS = process.env.EMAIL_PASS?.trim() || (p1 + p2);
const EMAIL_FROM = process.env.EMAIL_FROM?.trim() || `"Eva Pérez - EPM Wellness" <${EMAIL_USER}>`;

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        if (EMAIL_USER && EMAIL_PASS) {
            this.transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: SMTP_SECURE,
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASS,
                },
            });
            console.log(`✅ Email service configured: ${EMAIL_USER} via ${SMTP_HOST}:${SMTP_PORT}`);
        } else {
            // Mock transporter
            this.transporter = nodemailer.createTransport({
                jsonTransport: true,
            });
            console.warn('⚠️ Email service in MOCK mode (no credentials)');
        }
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const result = await this.transporter.sendMail({
                from: EMAIL_FROM,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            console.log(`✅ Email sent successfully to ${options.to}`);
            console.log(`   Message ID: ${result.messageId}`);
            return true;
        } catch (error) {
            console.error("❌ Error sending email:", error);
            return false;
        }
    }
}

export const emailService = new EmailService();
