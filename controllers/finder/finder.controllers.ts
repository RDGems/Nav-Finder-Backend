import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import Ride from '../../models/finder/ride.models';
import { getRandomInteger } from '../../utils/common/model.constants';
import { AuthRequest } from '../../utils/common/allInterface';
import Driver from '../../models/driver/driver.models';

// send details of car and price to user
const afterLocation = asyncHandler(async (req: Request, res: Response) => {
    const { distance, travelTime } = req.body;
    console.log(distance,travelTime)
    if (!distance || !travelTime) {
        throw new ApiError(400, 'Missing required fields', []);
    }
    const options = [
        
        {
            vehicleType: "Nav Go",
            totalFare: distance * 7 + travelTime * .7 + 96,
            away: getRandomInteger(),
            person: 4,
            image: "uberGo",
            title: "Affordable, compact rides"
        },
        {
            vehicleType: "Nav XL",
            totalFare: distance * 10 + travelTime * 1 + 120,
            away: getRandomInteger(),
            person: 6,
            image: "uberXL",
            title: "Affordable, SUV rides"
        },
        {
            vehicleType: "Premium",
            totalFare: distance * 12 + travelTime * 1.5 + 125,
            away: getRandomInteger(),
            person: 4,
            image: "uberP",
            title: "Comfortable rides"
        },
        {
            vehicleType: "Intercity",
            totalFare: distance * 15 + travelTime * 2 + 205,
            away: getRandomInteger(),
            person: 4,
            image: "uberX",
            title: "Long distance rides"
        },
        {
            vehicleType: "Bike",
            totalFare: distance * 5 + travelTime * 0.5 + 40,
            away: getRandomInteger(),
            person: 1,
            image: "bike",
            title: "In hurry? break the traffic"
        },
        {
            vehicleType: "Packages",
            totalFare: parseFloat((distance * 10 + travelTime * 2 + 52.1).toFixed(2)),
            away: getRandomInteger(),
            image: "parsel",
            title: "Affordable, package delivery"
        },
        {
            vehicleType: "Rentals",
            totalFare: parseFloat((distance * 20 + travelTime * 2 + 200).toFixed(2)),
            away: getRandomInteger(),
            image: "uberXL",
            title: "Rent a car as you go"
        },
        {
            vehicleType: "Auto",
            totalFare: distance * 5 + travelTime * 0.5 + 60,
            away: getRandomInteger(),
            person: 3,
            image: "rickshaw",
            title: "Break the traffic jam"
        },
        {
            vehicleType: "Shuttle Bus",
            totalFare: distance * 3.5 + travelTime * 0.75 + 25,
            away: getRandomInteger(),
            image: "bus",
            title: "Affordable, public transport"
        }
    ]
    return res.json(new ApiResponse(200, options, "Successfully fetched fare details"))
});


// book a ride
const bookRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { pickupLocation, dropoffLocation, estimatedFare, vehicleType, paymentMethod, distance, duration } = req.body;
    const user = req.user?.id;
    if (!user) {
        throw new ApiError(401, "Login First to continue");
    }
    if (!pickupLocation || !dropoffLocation || !estimatedFare || !vehicleType || !paymentMethod || !distance || !duration) {
        throw new ApiError(400, 'Missing required fields', []);
    }

    // Fetch all drivers
    const drivers = await Driver.find();

    // Select a random driver
    const driver = drivers[Math.floor(Math.random() * drivers.length)];

    const newRide = await Ride.create({
        user,
        driver: driver._id, // Assign the random driver's id
        pickupLocation,
        dropoffLocation,
        rideStatus: "requested",
        estimatedFare,
        vehicleType,
        paymentMethod,
        distance,
        duration,
        totalFare: estimatedFare + estimatedFare * 0.18,
    });

    return res.json(new ApiResponse(200, newRide, "Successfully ride booked"));
});

// get all rides/activities
const getRides = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const rideStatus = req.query.rideStatus;
    console.log(userId)
    const pipeline = [];
    if (userId) {
        pipeline.push({ $match: { user: userId } });
    }
    if (rideStatus) {
        pipeline.push({ $match: { rideStatus: rideStatus } });
    }

    const rides = await Ride.aggregate(pipeline);

    return res.json(new ApiResponse(200, rides, "Successfully fetched rides"))
});

// cancel a ride
const cancelRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const rideId = req.query.rideId;
    if (!rideId) {
        throw new ApiError(400, 'Missing required fields', []);
    }
    const ride = await Ride.findByIdAndUpdate(rideId, { rideStatus: "cancelled", cancelledBy: req.user?.id }, { new: true });

    return res.json(new ApiResponse(200, ride, "Successfully cancelled ride"));
})

export { bookRide, afterLocation, getRides, cancelRide };