/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { OrderModel } from '../../models';
import { TRANSACTION_STATUS } from '../../constants';

export default ({
    id,
    limit = 10,
    page = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await OrderModel.aggregate([
            {
                $match: {
                    customerRef: new Types.ObjectId(id),
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
                                        {
                                            $eq: ['$status', TRANSACTION_STATUS.COMPLETED],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'transactions',
                },
            },
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $gt: [{ $size: '$transactions' }, 0],
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: 'suborders',
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
                    as: 'subOrder',
                },
            },
            {
                $unwind: {
                    path: '$subOrder',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    orderId: '$_id',
                    subOrderId: '$subOrder._id',
                    subOrderFormatId: '$subOrder.id',
                    status: '$subOrder.status',
                    date: '$createdAt',
                    totalAmount: {
                        $multiply: [
                            '$subOrder.price',
                            '$subOrder.quantity',
                        ],
                    },
                    price: '$subOrder.price',
                    quantity: '$subOrder.quantity',
                },
            },
            {
                $facet: {
                    list: [
                        {
                            $skip: (page - 1) * limit,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                    total: [
                        {
                            $count: 'count',
                        },
                    ],
                },
            },
            {
                $unwind: '$total',
            },
        ]);

        resolve(new ApiResponseUtility({
            message: 'Orders fetched successfully.',
            data: {
                orders: ((data || {}).list || []),
                page,
                limit,
                total: (((data || {}).total || {}).count || 0),
                size: ((data || {}).list || []).length,
                hasMore: (page * limit) < (((data || {}).total || {}).count || 0),
            },
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching orders.', error }));
    }
});
