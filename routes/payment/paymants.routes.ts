import express from "express";
import { lookups } from "../../controllers/lookups/lookups";
import { checkout, sendApiKey, verifyPayment } from "../../controllers/payment/payments.controllers";

const paymentRoute = express.Router();


paymentRoute.post("/checkout", checkout);
paymentRoute.get("/getKey", sendApiKey);
paymentRoute.post("/verifyPayment", verifyPayment);


export { paymentRoute }