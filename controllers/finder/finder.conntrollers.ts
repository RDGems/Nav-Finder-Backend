import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import TempDriver from '../../models/driver/tempDriver.models';
import { AuthRequest} from '../../utils/allinterfaces';
import Ride from '../../models/finder/ride.models';

// send details of car and price to user
const afterLocation = asyncHandler(async (req: Request, res: Response) => {
    const { distance, travelTime } = req.body;
    if(!distance || !travelTime){
        throw new ApiError( 400 ,'Missing required fields',[]);
    }
    const distanceFare = distance * 0.5;
    const timeFare = travelTime * 0.1;
    const surgeFare
});


// book a ride
 const bookRide = asyncHandler(async (req: Request, res: Response) => {
    const { user, driver, pickupLocation, dropoffLocation,  estimatedFare,
        rideType,
        paymentMethod } = req.body;

    if (!user || !driver || !pickupLocation || !dropoffLocation || !estimatedFare||!rideType||!paymentMethod) {
        throw new ApiError( 400 ,'Missing required fields',[]);
    }

    const newRide = await Ride.create({
        user,
        driver,
        pickupLocation,
        dropoffLocation,
        status: 'booked',
        estimatedFare,
        rideType,
        paymentMethod
    });

  
    return res.json(new ApiResponse(200, newRide, "Successfully ride booked"))
});
export { bookRide };