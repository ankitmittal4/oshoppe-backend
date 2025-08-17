import express from 'express';
import { payment, verifyPayment, failedPayment } from '../controllers/payment/payment.js';
import { AuthenticationMiddleware } from "../middlewares"
// import { verifyJWT } from '../middlewares/auth.middleware.js';

export default (app) => {
    app.post("/api/payment/create-order", AuthenticationMiddleware.authenticateCustomer, payment);
    app.post("/api/payment/verify", AuthenticationMiddleware.authenticateCustomer, verifyPayment);
    app.post("/api/payment/failed", AuthenticationMiddleware.authenticateCustomer, failedPayment);
};
