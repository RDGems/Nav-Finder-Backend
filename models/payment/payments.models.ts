
import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";
const paymentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    method: { type: String, required: true },
},{ timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;