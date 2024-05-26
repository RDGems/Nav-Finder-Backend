import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import TempDriver from '../../models/driver/tempDriver.models';
import { AuthRequest, DriverAuthRequest } from '../../utils/allinterfaces';
import Driver from '../../models/driver/driver.models';
import User from '../../models/auth/user.models';
import { addMonths, isAfter } from 'date-fns';
import { driverVerificationMailgenContents,sendMail } from '../../utils/mail/sendmail.utils';

// preferred place to drive and earn
const driverPrefernce = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { preferredPlace, location } = req.body;
    const url = req.originalUrl.split("/").pop();
    if (!preferredPlace) {
        throw new ApiError(401, "Please proveide the required details", []);
    }
    const currenntUser = req.user?.id;
    if (!currenntUser) {
        throw new ApiError(400, "User Id is  missing", []);
    }
    const tempDriver = new TempDriver({
        driverDetail: currenntUser,
        preferredWorkingArea: {
            name: preferredPlace,
            location: {
                type: 'Point',
                coordinates: location
            }
        },
        stage: url
    })
    const savedTempDriver = await tempDriver.save();
    if (!savedTempDriver) {
        throw new ApiError(400, "Error while saving the data", []);
    }
    const driverToken = await savedTempDriver.generateDriverToken();
    res.json(new ApiResponse(200, driverToken, "Success"))
})
// driver vehicle type 
const driverVehicleType = asyncHandler(async (req: DriverAuthRequest, res: Response) => {
    const { vehicleType } = req.body;
    if (!vehicleType) {
        throw new ApiError(401, "Please proveide the required details", []);
    }
    const url = req.originalUrl.split("/").pop();
    const driverModelID = req.data?.id;
    if (!driverModelID) {
        throw new ApiError(400, "Driver Id is  missing", []);
    }
    const tempDriver = await TempDriver.findOne({ _id: driverModelID });
    if (!tempDriver) {
        throw new ApiError(400, "Driver not found", []);
    }
    tempDriver.vehicleType = vehicleType;
    tempDriver.stage = url;
    const savedTempDriver = await tempDriver.save();
    if (!savedTempDriver) {
        throw new ApiError(400, "Error while saving the data", []);
    }
    res.json(new ApiResponse(200, "Success", savedTempDriver))
});

// documents uplaod controllers
const uploadDocumentDetails = asyncHandler(async (req: DriverAuthRequest, res: Response) => {
    const driverModelID = req.data?.id;
    if (!driverModelID) {
        throw new ApiError(400, "Driver Id is  missing", []);
    }
    const url = req.originalUrl.split("/").pop();
    const { documentType, documentOwnerName, documentNumber, documentExpiryDate } = req.body;
    const currenntDriver = await TempDriver.findOne({ _id: driverModelID });
    if (!currenntDriver) {
        throw new ApiError(400, "Driver not found", []);
    }
    if (url != documentType) {
        throw new ApiError(400, "Invalid document type", []);
    }
    if (documentExpiryDate) {
        const expiryDate = new Date(documentExpiryDate);
        const sixMonthsFromNow = addMonths(new Date(), 6);
        if (!isAfter(expiryDate, sixMonthsFromNow)) {
            throw new ApiError(400, "Expiry date should be at least 6 months from today", []);
        }
    }
    let imageUrl = '';
    if (req.file) {
        imageUrl = req.file.location;
    }
    currenntDriver.stage = url;
    currenntDriver.documents[documentType] = {
        ownerName: documentOwnerName,
        number: documentNumber,
        expiryDate: documentExpiryDate,
        [documentType + "Image"]: {
            url: imageUrl,
        }
    };
    const savedTempDriver = await currenntDriver.save();
    if (!savedTempDriver) {
        throw new ApiError(400, "Error while saving the data", []);
    }
    res.json(new ApiResponse(200, "Success"))
})
// create a new Driver after authorization process 
const createDriver = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "Please provide the required details", []);
        }
    
        const tempDriver = await TempDriver.findOne({ driverDetail: userId }).select(' -_id -createdAt -updatedAt -__v  ');
        if (!tempDriver) {
            throw new ApiError(400, "Driver not found", []);
        }
        if (tempDriver.stage != 'driverPhoto') {
            throw new ApiError(400, "Please complete the previous steps", []);
        }
        const existingDriverId = await Driver.findOne({ driverDetail: userId });
        if (existingDriverId) {
            throw new ApiError(400, "Driver already exists", []);
        }
        const validatedDriver = await Driver.create(tempDriver.toObject());
        await User.findByIdAndUpdate(userId, { isDriver: true });
    
        // Fetch the user's email
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(400, "User not found", []);
        }
    
        // Generate the email content
        const mailOptions = {
            email: user.email,
            subject: 'Driver Verification Successull',
            mailgenContent: driverVerificationMailgenContents(user.userName)
        };
    
        // Send the email
        await sendMail(mailOptions);
    return res.json(new ApiResponse(200, validatedDriver, "Successfuly created driver profile"))
})
const deleteDriver = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Please proveide the required details", []);
    }
    const tempDriver = await TempDriver.findOneAndDelete({ driverDetail: userId })
    if (!tempDriver) {
        throw new ApiError(400, "Driver not found", []);
    }
    return res.json(new ApiResponse(200, [], "Successfuly deleted driver profile"))
})

export { driverPrefernce, driverVehicleType, uploadDocumentDetails, createDriver ,deleteDriver}