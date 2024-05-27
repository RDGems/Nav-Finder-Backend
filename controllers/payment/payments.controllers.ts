import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import { lookupData } from '../../utils/common/lokkupsData';
import { instance } from '../../utils/razorpay/razorpay';
import crypto from 'crypto';
import { AuthRequest } from '../../utils/allinterfaces';
import Payment from '../../models/payment/payments.models';
import Ride from '../../models/finder/ride.models';


export const checkout = asyncHandler(async (req: Request, res: Response) => {
    const {amount} = req.body;
    if(!amount){
        throw new ApiError(400, 'Amount is required');
    }
    console.log(amount);
    const options={
        amount:amount*100,
        currency:"INR",
    }
    const order = await instance.orders.create(options);
    return res.status(200).json(new ApiResponse(200, order,'payments' ));
});

export const sendApiKey = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(new ApiResponse(200, {key:process.env.RAZORPAY_KEY_ID},'payments' ));
});

export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
   const {RazorpayOrderId, RazorpayPaymentId, RazorpaySignature,rideId} = req.body;
   console.log(req.body)
    if(!RazorpayOrderId || !RazorpayPaymentId || !RazorpaySignature){
         throw new ApiError(400, 'RazorpayOrderId, RazorpayPaymentId, RazorpaySignature are required');
    }
    const body = RazorpayOrderId + "|" + RazorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body.toString()).digest('hex');
    if(expectedSignature !== RazorpaySignature){
        throw new ApiError(400, 'Signature mismatch');
    }
    else{
        console.log('Payment verified');
        const payment = new Payment({
            user: req.user?.id, // Assuming you have the user's ID in req.user._id
            orderId: RazorpayOrderId,
            paymentId: RazorpayPaymentId,
            amount: req.body.amount, // Assuming you have the amount in req.body.amount
            currency: 'INR', // Assuming the currency is INR
            status: 'success', // Assuming the payment is successful
            method: req.body.method // Assuming you have the payment method in req.body.method
        });

        // Save the payment to the database
        await payment.save();
        // await Ride.
        return res.status(200).json(new ApiResponse(200, {message:'Payment successful'},'payments' ));
        // return res.redirect(`http://localhost:3000/paymentSuccess?reference=${RazorpayPaymentId}`);
    }

});
export const getCallBack=asyncHandler(async(req:Request,res:Response)=>{
        // Razorpay sends the payment details as query parameters
        const rideId=req.params.paymentId;
        await Ride.findByIdAndUpdate(rideId,{paymentStatus:'success'})
    
        // TODO: Verify the payment using the Razorpay API and your secret key
    
        // Send a response back to Razorpay
        res.status(200).send('Payment verification successful');

})