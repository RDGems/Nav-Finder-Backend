import express from 'express';
import User from '../../models/auth/user.models'
import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/asyncHandler';

// Generate Access and Refresh Token for user
const generateAccessRefreshToken = asyncHandler(async (userId: any) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return new ApiResponse(200, { accessToken, refreshToken });
});

// Register user process
const register = asyncHandler(async (req: Request, res: Response) => {
    // data from request body
    let { userName, email, password } = req.body
    userName = userName.replace(/\s/g, '');
    // validate data presence in DB
    if (!userName || !email || !password) {
        throw new ApiError(400, "Please provide all the required fields", []);
    };
    // check if user already exists
    const isExistingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (isExistingUser) throw new ApiError(409, "User already exists");

    // create new user
    const user = await User.create({ userName, email, password });
    // email verification prcocess-otp
    // send response
    return res.status(200).json(new ApiResponse(200, user, "User Created Successfully"));
});




















































export { generateAccessRefreshToken, register };