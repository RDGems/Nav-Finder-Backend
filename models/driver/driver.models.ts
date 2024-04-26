

import mongoose, { Schema } from "mongoose";

const carSchema = new Schema({
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
        aadhaarNumber: {
            number: { type: String },
            aadhaarNumberImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        },
        panCardNumber: {
            number: { type: String },
            panCardNumberImage: {
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
            permitImage: {
                type: {
                    url: String,
                    localPath: String,
                },
            }
        }
    },
    carDetails: carSchema,
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
    }
}, { timestamps: true });

const Driver = mongoose.models.driver || mongoose.model("Driver", driverSchema);
export default Driver;
