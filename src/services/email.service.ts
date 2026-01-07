import nodemailer, { Transporter } from "nodemailer"
import { env } from "../config/env"
import { logger } from "../utils/logger"
import { verifyEmailTemplate } from "../emails/templates/verify-email.template"

export class EmailService {
  private transporter: Transporter | null = null

  constructor() {
    if (env.email.smtp.host && env.email.smtp.user && env.email.smtp.password) {
      this.transporter = nodemailer.createTransport({
        host: env.email.smtp.host,
        port: env.email.smtp.port,
        secure: env.email.smtp.secure,
        auth: {
          user: env.email.smtp.user,
          pass: env.email.smtp.password
        }
      })
    } else {
      logger.warn('Email service not configured. Emails will be logged to console.')
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${env.frontendUrl}/auth/verify-email?token=${token}`

    const mailOptions = {
      from: env.email.from,
      to: email,
      subject: 'Verify Your Email Address',
      html: verifyEmailTemplate(verificationUrl)
    }

    await this.sendEmail(mailOptions)
  }

  private async sendEmail(mailOptions: any): Promise<void> {
    if (!this.transporter) {
      // Log email to console in development
      logger.info('📧 Email (not sent, SMTP not configured):')
      logger.info(`To: ${mailOptions.to}`)
      logger.info(`Subject: ${mailOptions.subject}`)
      logger.info(`Body: ${mailOptions.html}`)
      return
    }

    try {
      await this.transporter.sendMail(mailOptions)
      logger.info(`Email sent to ${mailOptions.to}`)
    } catch (error) {
      logger.error('Error sending email:', error)
      throw new Error('Failed to send email')
    }
  }
}

export const emailService = new EmailService()
