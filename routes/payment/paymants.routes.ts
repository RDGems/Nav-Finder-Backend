import express from "express";
import { lookups } from "../../controllers/lookups/lookups";
import { checkout, getCallBack, sendApiKey, verifyPayment } from "../../controllers/payment/payments.controllers";

const paymentRoute = express.Router();


paymentRoute.post("/checkout", checkout);
paymentRoute.get("/getKey", sendApiKey);
paymentRoute.get("/getCallback/:paymentId", getCallBack);
paymentRoute.post("/verifyPayment", verifyPayment);


export { paymentRoute }