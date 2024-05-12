import mongoose, { Schema } from "mongoose";
const rideSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
        placeId: String,
        formattedAddress: String
    },
    dropoffLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number],
        placeId: String,
        formattedAddress: String
    },
    rideType: { type: String, enum: ['standard', 'premium'], default: 'standard' },
    rideStatus: { type: String, enum: ['requested', 'accepted', 'in_progress', 'completed'], default: 'requested' },
    estimatedFare: { type: Number },
    distance: { type: Number },
    duration: { type: Number },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    driverVehicle: {
        make: { type: String },
        model: { type: String },
        licensePlate: { type: String }
    },
    paymentMethod: { type: String, enum: ['credit_card', 'cash'], default: 'credit_card' },
    totalFare: { type: Number },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    rideRequestTime: { type: Date, default: Date.now },
    rideAcceptTime: { type: Date },
    rideStartTime: { type: Date },
    rideEndTime: { type: Date },
    specialRequests: { type: String },
    route: {
        overview_polyline: { type: String },
        duration: { type: Number },
        distance: { type: Number }
    },
    userRating: { type: Number },
    userFeedback: { type: String }
});

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;