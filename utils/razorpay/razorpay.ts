import Razorpay from 'razorpay';
require('dotenv').config();
console.log(process.env.RAZORPAY_KEY_ID);
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
