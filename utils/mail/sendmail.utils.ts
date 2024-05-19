import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { mailOptions } from "../allinterfaces";
require("dotenv").config();

// Function to send mail using Nodemailer and SendGrid
const sendMail = async (options: mailOptions) => {
    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey', // This is fixed, always 'apikey'
            pass: process.env.SENDGRID_API_KEY // Your SendGrid API Key
        }
    });

    // Mail content
    const mail = {
        from: process.env.MAIL_FROM,
        to: options.email,
        subject: options.subject,
        html: options.mailgenContent
    };

    try {
        // Sending mail
        await transporter.sendMail(mail);
        console.log("Email sent successfully to " + options.email);
    } catch (error) {
        console.error("Error sending email: ", error);
        console.log(
            "Email service failed silently. Make sure you have provided your SendGrid credentials in the .env file"
        );
    }
};

// Function to generate email verification content using Mailgen
const emailVerificationMailgenContents = (username: string, verificationUrl: string) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Navfinder',
            link: 'https://nav-finder-backend.onrender.com/api/docs'
        }
        
    });

    return mailGenerator.generate({
        body: {
            name: username,
            intro: "Welcome to our app! We're very excited to have you on board.",
            action: {
                instructions: "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
            
        },
    });
};

// Function to generate forgot password content using Mailgen
const forgotPasswordMailgenContents = (username: string, otp: string) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Navfinder',
            link: 'https://nav-finder-backend.onrender.com/api/docs'
        },
        
        
    });

    return mailGenerator.generate({
        body: {
            name: username,
            intro: `You have received this email because a password reset request for your account was received.<br><br> <h2 style='color: red;'>Your OTP is: ${otp}</h2>`,
            outro: "If you did not request a password reset, no further action is required on your part.",
        },
    });
};

export { sendMail, emailVerificationMailgenContents, forgotPasswordMailgenContents };
