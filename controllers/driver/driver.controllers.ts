import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import TempDriver from '../../models/driver/tempDriver.models';
import { AuthRequest, DriverAuthRequest } from '../../utils/allinterfaces';
import Driver from '../../models/driver/driver.models';
import User from '../../models/auth/user.models';


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
    res.json(new ApiResponse(200, "Success", driverToken))
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
    let imageUrl='';
    if(req.file){
        imageUrl=req.file.location;
    }
    currenntDriver.stage = url;
    currenntDriver.documents[documentType] = {
        ownerName: documentOwnerName,
        number: documentNumber,
        expiryDate: documentExpiryDate,
        [documentType +"Image"]:{
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
    // const { userId } = req.body;
    const userId =req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Please proveide the required details", []);
    }
    
    const tempDriver = await TempDriver.findOne({ driverDetail: userId }).select(' -_id -createdAt -updatedAt -__v  ');
    if (!tempDriver) {
        throw new ApiError(400, "Driver not found", []);
    }
    if (tempDriver.stage != 'driverPhoto') {
        throw new ApiError(400, "Please complete the previous steps", []);
    }
    const existingDriverId=await Driver.findOne({driverDetail:userId});
    if(existingDriverId){
        throw new ApiError(400, "Driver already exists", []);
    }
    const validatedDriver= await Driver.create(tempDriver.toObject());
    await User.findByIdAndUpdate(userId,{isDriver:true});
    return res.json(new ApiResponse(200,validatedDriver,"Successfuly created driver profile"))
})


export { driverPrefernce, driverVehicleType, uploadDocumentDetails ,createDriver}