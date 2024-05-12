import express from "express";
import { createDriver, driverPrefernce, driverVehicleType, uploadDocumentDetails } from "../../controllers/driver/driver.controllers";
import { aadhaarCardValidator, driverPhotoValidator, driverPrefernceValidator, driverVehicleTypeValidator, drivingLicenceValidator, insuranceValidator, panCardValidator, vehiclePermitValidator, vehicleRegistrationValidator } from "../../validators/driver/driver.validators";
import { validate } from "../../validators/validate";
import { driverApiAuthorization } from "../../middlewares/driverApiAuthorizaion";
import upload from "../../middlewares/multer.middleware";


const driverRoutes = express.Router();


driverRoutes.post("/preferedLocation", driverPrefernceValidator(), validate, driverPrefernce);
driverRoutes.post("/driverVehicleType", driverApiAuthorization, driverVehicleTypeValidator(), validate, driverVehicleType);
driverRoutes.post("/document/vehiclePermit", driverApiAuthorization, upload.single('documentImage'), vehiclePermitValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/aadhaarcard", driverApiAuthorization, upload.single('documentImage'), aadhaarCardValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/driverPhoto", driverApiAuthorization, upload.single('documentImage'), driverPhotoValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/pancard", driverApiAuthorization, upload.single('documentImage'), panCardValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/drivingLicence", driverApiAuthorization, upload.single('documentImage'), drivingLicenceValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/insurance", driverApiAuthorization, upload.single('documentImage'), insuranceValidator(), validate, uploadDocumentDetails);
driverRoutes.post("/document/vehicleRegistration", driverApiAuthorization, upload.single('documentImage'), vehicleRegistrationValidator(), validate, uploadDocumentDetails);


driverRoutes.post("/createDriver",  createDriver);

export { driverRoutes }