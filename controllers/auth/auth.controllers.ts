import express from 'express';
import User from '../../models/auth/user.models'
import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/asyncHandler';
import { AuthRequest } from '../../utils/common/allInterface';

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
    // send response
    return res.status(200).json(new ApiResponse(200, user, "User Created Successfully"));
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
    const userDetails = await User.findById(isExistingUser._id).select("userName email accountType AccountStatus isOnboarded  avatar ");
    // send response
    return res.status(200).cookie("refreshToken", refreshToken, refreshOptions).
        cookie("accessToken", accessToken, accessOptions).json(new ApiResponse(200, userDetails, "Login Successful"));
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

    const filteredData: Record<string, any> = Object.keys(data)
        .filter(key => schemaKeys.includes(key))
        .reduce((obj: Record<string, any>, key) => {
            obj[key] = data[key];
            return obj;
        }, {});

    // save in Db
    const onboarderUser = await User.findByIdAndUpdate(req.user?.id, { ...filteredData, isOnboarded: true }, { new: true });
    // Check if the user was found and updated
    if (!onboarderUser) {
        throw new Error('User not found');
    }
    // send response
    return res.status(200).json(new ApiResponse(200, onboarderUser, "Onboarding Successful"));
});



export { generateAccessRefreshToken, register, login, logout, onboarding };