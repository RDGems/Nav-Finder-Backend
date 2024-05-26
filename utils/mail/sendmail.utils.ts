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
const emailVerificationMailgenContents = (username: string,otp: string) => {
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
                instructions: "To verify your account, please use the following OTP:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: `OTP: ${otp}`,
                    link: '#', // You can replace this with a link to a page where the user can enter the OTP
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
const driverVerificationMailgenContents = (username: string) => {
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
            intro: "Congratulations! Your driver account has been successfully created and verified.",
            action: {
                instructions: "You can now start accepting rides. Log in to your account to get started.",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Log in to your account",
                    link: 'https://nav-finder-backend.onrender.com/login', // Replace with the actual login URL
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    });
};
const rideBookingConfirmationMailgenContents = (username: string, driverName: string, carNumber: string, phoneNumber: string, driverPhotoUrl: string, otp: string) => {
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
            intro: [
                "Your ride booking has been confirmed! Here are the details of your ride:",
                `<img src="${driverPhotoUrl}" alt="Driver's Profile Photo" style="width: 100px; height: 100px; border-radius: 50%;">`,
                `Your OTP for the ride is: ${otp} Please share it with the driver to start the ride.`,
            ],
            table: {
                data: [
                    {item: 'Driver Name', info: driverName},
                    {item: 'Car Number', info: carNumber},
                    {item: 'Phone Number', info: phoneNumber},
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        item: '20%',
                        info: '80%'
                    }
                }
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    });
};
export { sendMail, emailVerificationMailgenContents, forgotPasswordMailgenContents,driverVerificationMailgenContents, rideBookingConfirmationMailgenContents,};
