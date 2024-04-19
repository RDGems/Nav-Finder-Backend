import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { mailOptions } from "../allinterfaces";
require("dotenv").config();

const sendMail = async (options: mailOptions) => {
    // 1. Initialise the mailgen instance with default theme and brand configurations

    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "NavFinder",
            link: "Any.com"
        }
    })

    // 2. Generate a plain text version of email for those client which doesn't support html
    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

    // 3. Generate a html version
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    // 4. Nodemailer transporter
    const transporter = await nodemailer.createTransport(
        {
            host: process.env.MAILTRAP_SMTP_HOST!,
            port: Number(process.env.MAILTRAP_SMTP_PORT!),
            auth: {
                user: process.env.MAILTRAP_SMTP_USER!,
                pass: process.env.MAILTRAP_SMTP_PASS!
            }
        }
    );
    const mail = {
        from: process.env.MAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHtml
    }
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
        // So it's better to fail silently rather than breaking the app
        console.log(
            "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
        );
        console.log("Error: ", error);
    }
}


const emailVerificationMailgenContents = (username: any, verificationUrl: any) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our app! We're very excited to have you on board.",
            action: {
                instructions:
                    "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro:
                "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
const forgotPasswordMailgenContents = (username: any, otp: any) => {
    return {
        body: {
            name: username,
            intro: "You have received this email because a password reset request for your account was received. <br><br> <h2 style='color: red;'>Your OTP is: " + otp + "</h2>",
            outro: "If you did not request a password reset, no further action is required on your part.",
        },
    };
};
export { sendMail, emailVerificationMailgenContents, forgotPasswordMailgenContents }