
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendOtpEmail = async (to: string, otp: string) => {
    // Check if SMTP credentials are present
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn("SMTP credentials missing. Falling back to console logging.");
        console.log(`[MOCK EMAIL] To: ${to}, OTP: ${otp}`);
        return true; // Return true so registration flow continues
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL || '"Exphouz" <no-reply@exphouz.com>',
            to,
            subject: "Your Verification Code - Exphouz",
            text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333;">Exphouz Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering with Exphouz. Please use the following OTP (One Time Password) to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF5722; background-color: #f9f9f9; padding: 10px 20px; border-radius: 5px; border: 1px dashed #FF5722;">${otp}</span>
                    </div>
                    <p>This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
                    <br/>
                    <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Exphouz. All rights reserved.</p>
                </div>
            `,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        // Fallback to console log even if configured but failed (e.g. wrong password)
        console.log(`[FALLBACK EMAIL] To: ${to}, OTP: ${otp}`);
        return true;
    }
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Check if SMTP credentials are present
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn("SMTP credentials missing. Falling back to console logging.");
        console.log(`[MOCK EMAIL] To: ${to}, Reset Link: ${resetLink}`);
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL || '"Exphouz" <no-reply@exphouz.com>',
            to,
            subject: "Reset Your Password - Exphouz",
            text: `Click here to reset your password: ${resetLink}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password. Click the button below to proceed:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #FF5722; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                    <br/>
                    <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Exphouz. All rights reserved.</p>
                </div>
            `,
        });

        console.log("Reset Password Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending reset email:", error);
        console.log(`[FALLBACK EMAIL] To: ${to}, Reset Link: ${resetLink}`);
        return true;
    }
};
