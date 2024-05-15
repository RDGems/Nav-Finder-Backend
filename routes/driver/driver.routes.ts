import express from "express";
import { createDriver, driverPrefernce, driverVehicleType, uploadDocumentDetails } from "../../controllers/driver/driver.controllers";
import { aadhaarCardValidator, driverPhotoValidator, driverPrefernceValidator, driverVehicleTypeValidator, drivingLicenceValidator, insuranceValidator, panCardValidator, vehiclePermitValidator, vehicleRegistrationValidator } from "../../validators/driver/driver.validators";
import { validate } from "../../validators/validate";
import { driverApiAuthorization } from "../../middlewares/driverApiAuthorizaion";
import { upload } from "../../utils/aws/aws.s3.config";


const driverRoutes = express.Router();


driverRoutes.post("/preferedLocation", driverPrefernceValidator(), validate, driverPrefernce);
driverRoutes.post("/driverVehicleType", driverApiAuthorization, driverVehicleTypeValidator(), validate, driverVehicleType);
driverRoutes.post("/document/vehiclePermit", driverApiAuthorization, upload.single('file'), vehiclePermitValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/aadhaarcard", driverApiAuthorization, upload.single('file'), aadhaarCardValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/driverPhoto", driverApiAuthorization, upload.single('file'), driverPhotoValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/pancard", driverApiAuthorization, upload.single('file'), panCardValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/drivingLicence", driverApiAuthorization, upload.single('file'), drivingLicenceValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/insurance", driverApiAuthorization, upload.single('file'), insuranceValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/vehicleRegistration", driverApiAuthorization, upload.single('file'), vehicleRegistrationValidator(), validate, uploadDocumentDetails);


driverRoutes.get("/createDriver",  createDriver);

export { driverRoutes }