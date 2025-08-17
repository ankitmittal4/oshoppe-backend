// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { User } from "../models/user.model.js";
// import { Transaction } from "../models/transaction.model.js";
import crypto from 'crypto';
import {
    CartModel, TransactionModel, OrderActivityModel, SubOrderModel,
} from '../../models';
import {
    TRANSACTION_STATUS, USER_TYPE, ORDER_STATUS, ORDER_STATUS_MESSAGE,
} from '../../constants';
import { OrderCreateController } from "../order"
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const payment = async (req, res) => {
    const { id } = req.body;
    // console.log("Body: ", req.body.id);
    const { amount, currency = 'INR', receipt = 'receipt#1942' } = req.body;

    try {
        const options = {
            amount: amount * 100,
            currency,
            receipt,
        };
        // console.log(options);
        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).json({ success: false, message: 'Order creation failed' });
        }
        const orderRes = await OrderCreateController({ id });
        // console.log("^^^ : ", orderRes.data);
        const orderId = orderRes.data;
        res.json({ success: true, message: 'Order creation Success', order, orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Order creation failed' });
    }
};

const verifyPayment = async (req, res) => {
    try {

        // console.log("In Verify: ", req.body);
        const { id } = req.body;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, orderId } = req.body;

        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
        const razorpayResponse = await razorpay.payments.fetch(razorpay_payment_id);

        // Example response includes "method"
        // { id, amount, currency, status, method, bank, wallet, vpa, ... }
        // console.log("Payment details:", payment?.method)
        // const user = await User.findById(_id);
        // const { walletBalance } = user;

        // const newBalance = walletBalance + Number(amount);

        // await User.findByIdAndUpdate(
        //     _id,
        //     { walletBalance: newBalance },
        //     { new: true }
        // );

        // const transactionId = razorpay_payment_id;
        // const orderId = razorpay_order_id;

        const transaction = new TransactionModel({
            customerRef: id,
            orderRef: orderId,
            description: 'Payment completed',
            amount: amount,
            tax: 0,
            fees: 0,
            razorpayResponse,
            status: TRANSACTION_STATUS.COMPLETED,
        });
        await transaction.save();
        await CartModel.deleteMany({
            customerRef: id,
        });
        const subOrders = await SubOrderModel.find({
            orderRef: orderId,
        });
        for (const subOrder of subOrders) {
            await OrderActivityModel.create({
                subOrderRef: subOrder._id,
                userType: USER_TYPE.ADMIN,
                status: ORDER_STATUS.PENDING,
                notes: '',
                message: ORDER_STATUS_MESSAGE[ORDER_STATUS.PENDING],
            });
        }
        // console.log(transaction);
        // res.status(200).json({ success: true, message: "Payment verified and wallet updated", transaction });
        res.status(200).json({ success: true, message: "Payment verified and order placed" });
        // res
        //     .status(200)
        //     .json(
        //         new ApiResponse(
        //             200,
        //             transaction,
        //             "Payment verified and wallet updated"
        //         )
        //     );
    } catch (error) {
        console.error(error);
        // throw new ApiError(500, "Payment verification failed");
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};

const failedPayment = async (req, res) => {
    try {
        // console.log("In Failed: ", req.body);
        // const { _id } = req.user;
        const { code, source, description, reason, order_id, payment_id, amount, razorpay_order_id } = req.body;

        // const user = await User.findById(_id);

        const transactionId = payment_id;
        const orderId = razorpay_order_id;
        // const transaction = await Transaction.create({
        //     userId: _id,
        //     transactionId: transactionId,
        //     orderId: orderId,
        //     amount: Number(amount),
        //     transactionType: "nothing",
        //     transactionStatus: "failed",
        //     message: "Added Money",
        // });
        // res
        //     .status(200)
        //     .json(
        //         new ApiResponse(
        //             200,
        //             transaction,
        //             "Payment failed successfully"
        //         )
        //     );
        // res.status(200).json({ success: true, message: "Payment failed successfully", transaction });
        res.status(200).json({ success: true, message: "Payment failed successfully" });
    } catch (error) {
        console.error("Payment failed error: ", error);
        res.status(500).json({ success: false, message: "Payment failed unsuccessfully" });
        // throw new ApiError(500, "Payment failed");
    }
};

export { payment, verifyPayment, failedPayment };