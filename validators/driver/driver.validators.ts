import { body, param } from "express-validator";
import { documentTypes, vehicleOptions } from "../../utils/common/model.constants";



const driverPrefernceValidator = () => {
    return [
        body("preferredPlace")
            .trim()
            .notEmpty()
            .withMessage("Preferred place is required"),
        body('location')
            .isArray({ min: 2, max: 2 })
            .withMessage('Location must contain 2 coordinates')
            .custom((value) => {
                if (typeof value[0] === 'number' && typeof value[1] === 'number') {
                    return true;
                } else {
                    throw new Error('Both coordinates must be numbers');
                }
            }),
    ];
}
const driverVehicleTypeValidator = () => {
    return [
        body("vehicleType")
            .trim()
            .notEmpty()
            .withMessage("Vehicle type is required")
            .isIn(vehicleOptions)
            .withMessage(`Vehicle type must be one of the following: ${vehicleOptions.join(', ')}`),
    ];
}

const vehiclePermitValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body("documentNumber")
            .trim()
            .notEmpty()
            .withMessage("Document Number is required"),
        body("documentOwnerName")
            .trim()
            .notEmpty()
            .withMessage("Owner Name is required"),
        body("documentExpiryDate")
            .trim()
            .notEmpty()
            .withMessage("Document Expiry Date is required"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })

    ]
}
const aadhaarCardValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body("documentNumber")
            .trim()
            .notEmpty()
            .withMessage("Aadhaar Card Number is required"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })
    ]
}

const panCardValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body("documentNumber")
            .trim()
            .notEmpty()
            .withMessage("PAN Card Number is required"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })
    ]
}

const drivingLicenceValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body("documentNumber")
            .trim()
            .notEmpty()
            .withMessage("Driving Licence Number is required"),

        body("documentExpiryDate")
            .trim()
            .notEmpty()
            .withMessage("Driving Licence Expiry Date is required"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })
    ]
}

const vehicleRegistrationValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body("documentNumber")
            .trim()
            .notEmpty()
            .withMessage("Vehicle Registration Number is required"),

        body("documentExpiryDate")
            .trim()
            .notEmpty()
            .withMessage("Vehicle Registration Expiry Date is required"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })
    ]
}

const insuranceValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body("documentNumber")
            .trim()
            .notEmpty()
            .withMessage("Insurance Number is required"),

        body("documentExpiryDate")
            .trim()
            .notEmpty()
            .withMessage("Insurance Expiry Date is required"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })
    ]
}

const driverPhotoValidator = () => {
    return [
        body("documentType")
            .trim()
            .notEmpty()
            .withMessage("Document Type is missing")
            .isIn(documentTypes)
            .withMessage("Document Type is not valid"),
        body('documentImage')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Image file is required');
                }

                // check file type
                if (!req.file.mimetype.startsWith('image/')) {
                    throw new Error('File is not an image');
                }

                return true;
            })
    ]
}
export {
    driverPrefernceValidator, driverVehicleTypeValidator, vehiclePermitValidator, aadhaarCardValidator,
    panCardValidator,
    drivingLicenceValidator,
    vehicleRegistrationValidator,
    insuranceValidator,
    driverPhotoValidator
}