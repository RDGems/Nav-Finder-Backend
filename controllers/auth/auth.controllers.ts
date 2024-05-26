
import User from '../../models/auth/user.models'
import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import { AuthRequest } from '../../utils/common/allInterface';
import { emailVerificationMailgenContents, forgotPasswordMailgenContents, sendMail } from '../../utils/mail/sendmail.utils';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import path from 'path';
// Generate Access and Refresh Token for user
const generateAccessRefreshToken = async (userId: any) => {
    try {
        const user: any = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found", []);
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error: any) {
        throw new ApiError(
            500,
            "Something went wrong while generating the access token", []
        );

    }

}

// Register user process
const register = asyncHandler(async (req: Request, res: Response) => {
    // data from request body
    let { userName, email, password } = req.body
    // validate data presence in DB
    if (!userName || !email || !password) {
        throw new ApiError(400, "Please provide all the required fields", []);
    };
    userName = userName.replace(/\s/g, '');

    // check if user already exists
    const isExistingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (isExistingUser) throw new ApiError(409, "User already exists");

    // create new user
    const user = await User.create({ userName, email, password });
    // email verification prcocess-otp
    const unHashedToken = await user.generateTemporaryToken();
    const data = {
        user: {
            email: user.email,
            userName: user.userName
        },
        req: {
            protocol: req.protocol,
            host: req.get('host')
        },
        unHashedToken: unHashedToken
    };
    // Send verification email
    let otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        // Store the OTP in the user's document for later verification
        user.otp = otp;
        await user.save();
    const mailOptions = {
        email: user.email,
        subject: 'Email Verification',
        mailgenContent: emailVerificationMailgenContents(user.userName, otp)
    };
    await sendMail(mailOptions);
    // Send the data to the queue
    // sendDataToQueue(JSON.stringify(data));
    // send response
    return res.status(200).json(new ApiResponse(200, user, "Please verify your email through otp"));
});
// Login user process
const login = asyncHandler(async (req: Request, res: Response) => {
    // data from request body
    let { userName, email, password } = req.body;
    // validate data presence in DB
    if (!email && !userName) {
        throw new ApiError(400, "Please fill all the credentials", [])
    }
    if (!password) {
        throw new ApiError(400, "Please provide password.")
    }
    if (userName) {
        userName = userName.replace(/\s/g, '').toLowerCase();
    }
    // check if user exists
    const isExistingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (!isExistingUser) throw new ApiError(404, "User not found");
    // validate password
    const isValid = await isExistingUser.validatePassword(password);
    if (!isValid) throw new ApiError(401, "Invalid Credentials");

    // const get access and refresh token
    const { accessToken, refreshToken } = await generateAccessRefreshToken(isExistingUser._id);
    let refreshOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD' ? true : false,
        path: '/',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    let accessOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD' ? true : false,
        path: '/',
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    };
    let userDetails = await User.findById(isExistingUser._id).select("userName email accountType AccountStatus isOnboarded isEmailVerified avatar firstName lastName");
    userDetails = userDetails.toObject();



    // send response
    return res.status(200)
        .cookie("accessToken", accessToken, accessOptions)
        .cookie("refreshToken", refreshToken, refreshOptions)
        .json(new ApiResponse(200, { ...userDetails, accessToken, refreshToken }, "Login Successful"));
});
// logout process
const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
        throw new ApiError(401, "Unauthorized access", []);
    }
    const userNotPresent = await User.findByIdAndUpdate(req.user?.id, { refreshToken: "" }, { new: true });
    if (!userNotPresent) throw new ApiError(404, "User not found", []);
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD" ? true : false,
    }
    return res.status(200).
        clearCookie("refreshToken", options).
        clearCookie("accessToken", options).
        json({
            success: true,
            message: "Successfully logged out.",
        });
});


// Onboarding process for user
const onboarding = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: Record<string, any> = { ...req.body };
    // Get the schema keys from the User model
    const schemaKeys = Object.keys(User.schema.paths);

    // Filter the data to only include keys that exist in the User schema
    let imageUrl;
    const filteredData: Record<string, any> = Object.keys(data)
        .filter(key => schemaKeys.includes(key))
        .reduce((obj: Record<string, any>, key) => {
            obj[key] = data[key];
            return obj;
        }, {});
    const onboarderUser = await User.findById(req.user?.id);
    if (!onboarderUser) {
        throw new Error('User not found');
    }
    if (!onboarderUser.isOnboarded) {
        imageUrl = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${onboarderUser.userName}&background=%23000000&radius=50&colorful=1`
    }
    let isEmailVerifiedValue = true;
    if (onboarderUser.email !== filteredData.email) {
        isEmailVerifiedValue = false;
    }
    const dob = new Date(onboarderUser.dob); // replace with the actual date of birth
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    
    if (dob > eighteenYearsAgo) {
        throw new ApiError(404, "User is not 18 years old yet'", []);
    }
    // upload profile picture to cloudinary

    if (req.file) {
        imageUrl = req.file.location;
    }
    onboarderUser.avatar = {
        url: imageUrl, // the URL of the uploaded image on Cloudinary
    };
    await onboarderUser.save();
    //    check that onboarderUser and filteredData.email same or not
    const updatedUser = await User.findByIdAndUpdate(req.user?.id, { ...filteredData, isOnboarded: true, isEmailVerified: isEmailVerifiedValue }, { new: true });
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return res.status(200).json(new ApiResponse(200, onboarderUser, "Onboarding Successful"));
});

// Resend Email
const resendEmailVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized access", []);
    }
    // generate temporary token
    const user = await User.findById(userId);
    const hashedToken = await user.generateTemporaryToken();
    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    // send email
    await sendMail({
        email: user.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContents(
            user.userName,
            `${req.protocol}://${req.get(
                "host"
            )}/api/v1/auth/verify-email/${hashedToken}`
        ),
    });
    return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
});

// Verify Email
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const token = req.params.token;
    if (!token) {
        throw new ApiError(400, "Token is missing", []);
    }
    const unHashedToken = Jwt.verify(token, process.env.JWT_EMAIL_TOKEN_SECRET!) as JwtPayload;
    const username = unHashedToken.userName;
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    if (user.isEmailVerified) {
        // If the user's email is already verified, send a different file and return
        res.sendFile(path.join(__dirname, '../../utils/alreadyVerifiedEmail.html'), (err) => {
            if (err) {
                throw new ApiError(400, "Something went wrong while sending the alreadyVerifiedEmail file", []);
            }
        });
        return;
    }
    await User.findOneAndUpdate({ username }, { isEmailVerified: true }, { new: true });
    res.sendFile(path.join(__dirname, '../../utils/email.html'), (err) => {
        if (err) {
            throw new ApiError(400, "Something went wrong while sending the email file", []);
        }
    })
});
// Refresh Token
const refreshTokenGeneration = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.headers.authorization?.split("Bearer")[1].trim() || req.cookies.accessToken;
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh Token is missing.", []);
    }
    // verify Jwt
    const unHashedToken = Jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!) as JwtPayload;
    if (!unHashedToken) {
        throw new ApiError(401, "Invalid Refresh Token", []);
    }
    // find user in db
    const user = await User.findById(unHashedToken?.id);
    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    // check if refresh token is valid or not
    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid Refresh Token", []);
    }
    // generate new access token
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);
    const accessOptions = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD" ? true : false,
    };

    const refreshOptions = {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "PROD" ? true : false,
    };
    // send response
    return res.status(200).cookie("refreshToken", refreshToken, refreshOptions).
        cookie("accessToken", accessToken, accessOptions).json({ success: true })
})
// forgot password
const forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            throw new ApiError(400, "Please provide email", []);
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not exists", []);
        }

        // Generate a 6-digit numeric OTP
        let otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        console.log(otp)
        // Store the OTP in the user's document for later verification
        user.otp = otp;
        await user.save();

        // send email
        await sendMail({
            email: user.email,
            subject: "Password Reset",
            mailgenContent: forgotPasswordMailgenContents(user.userName, otp),
        });

        return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
    }
);
// verify otp
const verifyOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new ApiError(400, "Please provide email and otp", []);
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not exists", []);
        }
        if (user.otp !== otp) {
            throw new ApiError(401, "Invalid OTP", []);
        }
        else {
            user.otp = null;
            await user.save();
        }
        return res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully"));
    }
);
// reset Password
const resetPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!password) {
            throw new ApiError(400, "Please provide password", []);
        }
        if (!email) {
            throw new ApiError(400, "Please provide Email", [])
        }
        const isExistingUser = await User.findOne({ email: email });
        if (!isExistingUser) {
            throw new ApiError(400, "User not exists", []);
        }
        isExistingUser.password = password;
        await isExistingUser.save();
        return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
    }
);
// Change Password
const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { oldPassword, password } = req.body;
    if (!oldPassword || !password) {
        throw new ApiError(400, "Please provide all the required fields", []);
    }
    if (oldPassword == password) {
        throw new ApiError(400, "Old password and new password should not be same", []);
    }
    const user = await User.findById(req.user?.id);
    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    console.log(user);
    const isValid = await user.validatePassword(oldPassword);
    if (!isValid) {
        throw new ApiError(401, "Invalid Old Password", []);
    }
    user.password = password;
    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));

});
// Get current user 
const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorized access", []);
    }
    const unHashedToken = Jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload;
    if (!unHashedToken) {
        throw new ApiError(401, "Invalid Token", []);
    }
    const user = await User.findById(unHashedToken.id);
    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    return res.status(200).json(new ApiResponse(200, user, "User details"));
});
// change AccountStatus
const changeAccountStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    if (!status) {
        throw new ApiError(400, "Please provide status", []);
    }
    const user = await User.findById(req.user?.id);
    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    user.AccountStatus = status;
    await user.save();
    return res.status(200).json(new ApiResponse(200, user, "Account status changed successfully"));
});

export { generateAccessRefreshToken, register, login, logout, onboarding, forgotPassword, verifyEmail, resendEmailVerification, refreshTokenGeneration, resetPassword, changePassword, getCurrentUser, verifyOtp, changeAccountStatus };