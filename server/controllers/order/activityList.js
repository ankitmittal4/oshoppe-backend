/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { OrderActivityModel } from '../../models';

export default ({
    subOrderId,
    limit = 10,
    page = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await OrderActivityModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ['$subOrderRef', new Types.ObjectId(subOrderId)],
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    subOrderRef: '$subOrderRef',
                    userType: '$userType',
                    status: '$status',
                    notes: '$notes',
                    message: '$message',
                    createdAt: '$createdAt',
                },
            },
            {
                $sort: {
                    createdAt: -1,
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
            message: 'Order activity fetched successfully.',
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
        reject(new ApiErrorUtility({ message: 'Error while fetching order activity.', error }));
    }
});
