import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import Ride from '../../models/finder/ride.models';
import { getRandomInteger } from '../../utils/common/model.constants';
import { AuthRequest } from '../../utils/common/allInterface';

// send details of car and price to user
const afterLocation = asyncHandler(async (req: Request, res: Response) => {
    const { distance, travelTime } = req.body;
    if(!distance || !travelTime){
        throw new ApiError( 400 ,'Missing required fields',[]);
    }
    const options=[
        {
            vehicleType:"BIKE",
            totalFare:distance *5 + travelTime *0.5+40,
            away:getRandomInteger()  
        },
        {
            vehicleType:"GO",
            totalFare:distance *7 + travelTime *.7+96,
            away:getRandomInteger()  
        },
        {
            vehicleType:"XL",
            totalFare:distance *10 + travelTime *1+120,
            away:getRandomInteger()  
        },
        {
            vehicleType:"PREMIUM",
            totalFare:distance *12 + travelTime *1.5+125,
            away:getRandomInteger()  
        },
        {
            vehicleType:"INTERCITY",
            totalFare:distance *15 +travelTime *2+200,
            away:getRandomInteger()  
        },
        {
            vehicleType:"PACKAGES",
            totalFare:distance *10 +travelTime *2+50,
            away:getRandomInteger()  
        },
        {
            vehicleType:"RENTALS",
            totalFare:distance *20 +travelTime *2+200,
            away:getRandomInteger()  
        },
        {
            vehicleType:"AUTO",
            totalFare:distance *5 + travelTime *0.5+60,
            away:getRandomInteger()  
        },
        {
            vehicleType:"BUS",
            totalFare:distance *3.5 + travelTime *0.75+25,
            away:getRandomInteger()  
        }
    ]
    return res.json(new ApiResponse(200, options, "Successfully fetched fare details"))
});


// book a ride
 const bookRide = asyncHandler(async (req: Request, res: Response) => {
    const { user, driver, pickupLocation, dropoffLocation,  estimatedFare,
        vehicleType,
        paymentMethod,distance,duration } = req.body;

    if (!user || !driver || !pickupLocation || !dropoffLocation || !estimatedFare||!vehicleType||!paymentMethod||!distance||!duration) {
        throw new ApiError( 400 ,'Missing required fields',[]);
    }

    const newRide = await Ride.create({
        user,
        driver,
        pickupLocation,
        dropoffLocation,
        rideStatus:"requested",
        estimatedFare,
        vehicleType,
        paymentMethod,
        distance,
        duration,
        totalFare:estimatedFare + estimatedFare * 0.18,
    });

  
    return res.json(new ApiResponse(200, newRide, "Successfully ride booked"))
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
        throw new ApiError( 400 ,'Missing required fields',[]);
    }
    const ride = await Ride.findByIdAndUpdate(rideId, { rideStatus: "cancelled",cancelledBy:req.user?.id }, { new: true });

    return res.json(new ApiResponse(200, ride, "Successfully cancelled ride"));
})

export { bookRide ,afterLocation,getRides,cancelRide};