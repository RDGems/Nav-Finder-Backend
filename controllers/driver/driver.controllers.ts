import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import TempDriver from '../../models/driver/tempDriver.models';
import { AuthRequest, DriverAuthRequest } from '../../utils/allinterfaces';


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
    currenntDriver.stage = url;
    currenntDriver.documents[documentType] = {
        ownerName: documentOwnerName,
        number: documentNumber,
        expiryDate: documentExpiryDate
    };
    const savedTempDriver = await currenntDriver.save();
    if (!savedTempDriver) {
        throw new ApiError(400, "Error while saving the data", []);
    }
    res.json(new ApiResponse(200, "Success"))
})



export { driverPrefernce, driverVehicleType, uploadDocumentDetails }