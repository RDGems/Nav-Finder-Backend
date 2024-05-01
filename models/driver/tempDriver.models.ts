

import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken"

const vehicalSchema = new Schema({
    manufacturer: { type: String },
    model: { type: String },
    year: { type: Number },
    registrationNumber: { type: String },
    vehicleType: { type: String },
    insurance: {
        number: { type: String },
        expiryDate: { type: Date },
        insuranceImage: {
            type: {
                url: String,
                localPath: String,
            },
        },
    },
    safetyFeatures: [{ type: String }],
    vehicleCondition: { type: String },
    maintenanceRecord: { type: String },
    ratings: { type: Number },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const driverSchema = new Schema({
    driverDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    documents: {
        aadhaarcard: {
            number: { type: String },
            aadhaarcardImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        },
        pancard: {
            number: { type: String },
            pancardImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        },
        drivingLicence: {
            number: { type: String },
            expiryDate: { type: Date },
            drivingLicenceImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        },
        vehicleRegistration: {
            number: { type: String },
            expiryDate: { type: Date },
            vehicleRegistrationImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        },
        insurance: {
            number: { type: String },
            expiryDate: { type: Date },
            insuranceImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            },
        },
        driverPhoto: {
            type: {
                url: String,
                localPath: String,
            },
        },
        vehiclePermit: {
            ownerName: { type: String },
            number: { type: String },
            expiryDate: { type: Date },
            vehiclePermitImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        }
    },
    vehicleType: { type: String, default: 'Car' },
    carDetails: vehicalSchema,
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    drivingHistory: {
        trafficViolations: [{ type: String }],
        previousDrivingExperience: { type: String }
    },
    availability: { type: Boolean, default: false },
    onlineStatus: { type: Boolean, default: false },
    lastOnlineTime: { type: Date },
    complaints: { type: [String] },
    tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    lastKnownLocation: {
        name: { type: String },
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'

            },
            coordinates: {
                type: [Number], // [longitude, latitude]

            }
        }
    },
    preferredWorkingArea: {
        name: { type: String },
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'

            },
            coordinates: {
                type: [Number], // [longitude, latitude]

            }
        }
    },
    stage: { type: String, default: null }
}, { timestamps: true });

driverSchema.methods.generateDriverToken = function () {
    return Jwt.sign({ user: this.driverDetail, id: this._id }, process.env.JWT_DRIVER_TOKEN_SECRET!, {
        expiresIn: process.env.JWT_DRIVER_TOKEN_EXPIRY
    })
}

const TempDriver = mongoose.models.tempdriver || mongoose.model("TempDriver", driverSchema);
export default TempDriver;
