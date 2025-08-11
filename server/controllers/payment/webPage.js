/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import Razorpay from 'razorpay';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { OrderModel, CustomerModel } from '../../models';
import { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY, NODE_ENV } from '../../constants';

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY,
});

export default ({
    id,
    orderId,
}) => new Promise(async (resolve, reject) => {
    try {
        const customerDetails = await CustomerModel.findOne({
            _id: id,
        });
        const orderDetails = await OrderModel.findOne({
            _id: orderId,
            customerRef: id,
        });

        const options = {
            amount: Number((orderDetails.price * 100).toFixed(2)),
            currency: 'INR',
            notes: {
                id,
                orderId,
            },
        };

        const order = await razorpayInstance.orders.create(options);
        let successPageUrl;
        let failPageUrl;
        if (NODE_ENV === 'development') {
            successPageUrl = `https://uat.oshoppe.in/profile/order/payment/${orderId}`;
            failPageUrl = 'https://uat.oshoppe.in/cart';
        } else {
            successPageUrl = `https://www.oshoppe.in/profile/order/payment/${orderId}`;
            failPageUrl = 'https://www.oshoppe.in/cart';
        }
        const params = {
            id,
            orderId,
            order_id: order.id,
            amount: order.amount,
            key_id: RAZORPAY_ID_KEY,
            product_name: 'PRODUCTS',
            description: 'OShoppe products',
            contact: customerDetails.phoneNumber,
            name: `${customerDetails.firstName} ${customerDetails.lastName}`,
            email: customerDetails.email,
            notes: {
                id,
                orderId,
            },
            successPageUrl,
            failPageUrl,
        };
        const html = fs.readFileSync(path.resolve(__dirname, '../../views', 'paymentPage.html'), { encoding: 'utf-8' });
        const template = handlebars.compile(html)(params);

        resolve(new ApiResponseUtility({ message: 'Payment web page', data: template }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while placing order.', error }));
    }
});
