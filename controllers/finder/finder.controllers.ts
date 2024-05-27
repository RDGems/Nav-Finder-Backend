import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import Ride from '../../models/finder/ride.models';
import { getRandomInteger } from '../../utils/common/model.constants';
import { AuthRequest } from '../../utils/common/allInterface';
import Driver from '../../models/driver/driver.models';
import mongoose from 'mongoose';
import otpGenerator from 'otp-generator';
import { rideBookingConfirmationMailgenContents, sendMail } from '../../utils/mail/sendmail.utils';
import User from '../../models/auth/user.models';
interface rideDetails {
    driverDetail: {
        userName: string,
        mobile: string,
        email: string,
        avatar: {
            url: string
        }

    }
}

// send details of car and price to user
const afterLocation = asyncHandler(async (req: Request, res: Response) => {
    const { distance, travelTime } = req.body;
    console.log(distance, travelTime)
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

// create a falke car number 
const createCarNumber = (pickupLocation: string) => {
    const carNumber = otpGenerator.generate(8, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: true, specialChars: false });
    return ((pickupLocation.substring(0, 2)).toUpperCase() + carNumber);
}
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
    const carNumber = createCarNumber(pickupLocation.type);
    const driverDetails = await User.findById(driver.driverDetail)

    const newRide = await Ride.create({
        user,
        driver: driver.driverDetail, // Assign the random driver's id
        pickupLocation,
        dropoffLocation,
        rideStatus: "requested",
        estimatedFare,
        vehicleType,
        paymentMethod,
        distance,
        duration,
        carNumber,
        totalFare: estimatedFare + estimatedFare * 0.18,
    });
    let otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const currentUser = await User.findByIdAndUpdate(user, { otp: otp }, { new: true })
    if (currentUser && driverDetails) {
        const mailOptions = {
            email: currentUser.email,
            subject: 'Ride Booking Confirmation',
            mailgenContent: rideBookingConfirmationMailgenContents(currentUser.userName, driverDetails.userName, carNumber, driverDetails.mobile, driverDetails.avatar.url, otp)
        }
        await sendMail(mailOptions);
    }
    return res.json(new ApiResponse(200, newRide, "Successfully ride booked"));
});

// get all rides/activities
// const getRides = asyncHandler(async (req: AuthRequest, res: Response) => {
//     const userId = req.user?.id as string;
//     if (!userId) {
//         throw new ApiError(401, "Login First to continue");
//     }
//     const rides = await Ride.aggregate([
//         { $match: { user: new mongoose.Types.ObjectId(userId) } },
//         { $sort: { createdAt: -1 } },
//         {
//             $lookup: {
//                 from: "drivers", // replace with your actual Driver collection name
//                 localField: "driver",
//                 foreignField: "_id",
//                 as: "driver"
//             }
//         },
//         { $unwind: "$driver" },
//         {
//             $lookup: {
//                 from: "users", // replace with your actual User collection name
//                 localField: "driver.driverDetail",
//                 foreignField: "_id",
//                 as: "driverDetail"
//             }
//         },
//         { $unwind: "$driverDetail" },
//         {
//             $project: {
//                 createdAt: 1,
//                 totalFare: 1,
//                 estimatedFare:1,
//                 rideStatus: 1,
//                 paymentStatus: 1,
//                 pickupLocation: 1,
//                 dropoffLocation: 1,
//                 "driverDetail.email": 1,
//                 "driverDetail.userName": 1
//             }
//         }, {
//             $group: {
//                 _id: "$rideStatus",
//                 rides: { $push: "$$ROOT" }
//             }
//         }
//     ]);
//     const acceptedRides = rides.find(group => group._id === 'requested')?.rides || [];
//     const requestedRides = rides.filter(group => group._id !== 'requested').flatMap(group => group.rides);
//     return res.json(new ApiResponse(200, { acceptedRides, requestedRides }, "Successfully fetched rides"))
// });
const getRides = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id as string;
    const isDriver = req.user?.isDriver as boolean
    if (!userId) {
        throw new ApiError(401, "Login First to continue");
    }
    const rides = await Ride.aggregate([
        { $match: isDriver ? { driver: new mongoose.Types.ObjectId(userId) }  : { user: new mongoose.Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$rideStatus",
                rides: { $push: "$$ROOT" }
            }
        }
    ]);
    const acceptedRides = rides.find(group => group._id === 'requested')?.rides || [];
    const requestedRides = rides.filter(group => group._id !== 'requested').flatMap(group => group.rides);
    return res.json(new ApiResponse(200, { acceptedRides, requestedRides, isDriver }, "Successfully fetched rides"))
});
// cancel a ride
const cancelRide = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { rideId, type } = req.query;
    if (!rideId) {
        throw new ApiError(400, 'Missing required fields', []);
    }
    if (!type || (type != "cancelled" && type != "accepted")) {
        throw new ApiError(400, "Not a valid operation", []);
    }
    const ride = await Ride.findByIdAndUpdate(rideId, { rideStatus: type, cancelledBy: req.user?.id }, { new: true });

    return res.json(new ApiResponse(200, ride, `Successfully ${type} ride`));
})

export { bookRide, afterLocation, getRides, cancelRide };