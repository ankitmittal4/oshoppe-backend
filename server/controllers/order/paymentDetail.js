/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { OrderModel } from '../../models';

export default ({
    orderId,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await OrderModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(orderId),
                },
            },
            {
                $lookup: {
                    from: 'customers',
                    let: { customerId: '$customerRef' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$_id', '$$customerId'],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'customer',
                },
            },
            {
                $unwind: {
                    path: '$customer',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'transactions',
                    let: { orderId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$orderRef', '$$orderId'],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'transaction',
                },
            },
            {
                $unwind: {
                    path: '$transaction',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    customerName: {
                        $concat: ['$customer.firstName', ' ', '$customer.lastName'],
                    },
                    transactionId: '$transaction._id',
                    paymentMode: '$transaction.razorpayResponse.paymentMethod',
                    phoneNumber: '$customer.phoneNumber',
                    email: '$customer.email',
                    amount: '$transaction.amount',
                },
            },
        ]);

        resolve(new ApiResponseUtility({
            message: 'Order payment details fetched successfully.',
            data,
        }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while fetching order payment details.', error }));
    }
});
