/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { OrderModel } from '../../models';

export default ({
    limit = 10,
    page = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await OrderModel.aggregate([
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
                        {
                            $lookup: {
                                from: 'products',
                                let: { productId: '$productRef' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: ['$_id', '$$productId'],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            _id: '$_id',
                                            name: '$name',
                                            quantity: '$quantity',
                                            sellingPrice: '$sellingPrice',
                                            image: '$image1',
                                            brand: '$brand',
                                            size: '$quantity',
                                        },
                                    },
                                ],
                                as: 'product',
                            },
                        },
                        {
                            $unwind: {
                                path: '$product',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: 'dealers',
                                let: { dealerId: '$dealerRef' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: ['$_id', '$$dealerId'],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            _id: '$_id',
                                            firstName: '$firstName',
                                            lastName: '$lastName',
                                            email: '$email',
                                        },
                                    },
                                ],
                                as: 'dealer',
                            },
                        },
                        {
                            $unwind: {
                                path: '$dealer',
                                preserveNullAndEmptyArrays: true,
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
                        {
                            $project: {
                                _id: '$_id',
                                firstName: '$firstName',
                                lastName: '$lastName',
                                email: '$email',
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
                    from: 'addresses',
                    let: { addressId: '$addressRef' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$_id', '$$addressId'],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                customerRef: 0,
                                isDefault: 0,
                                deleted: 0,
                                createdAt: 0,
                                updatedAt: 0,
                                __v: 0,
                            },
                        },
                    ],
                    as: 'address',
                },
            },
            {
                $unwind: {
                    path: '$address',
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
                    orderId: '$_id',
                    subOrderId: '$subOrder._id',
                    subOrderFormatId: '$subOrder.id',
                    productName: '$subOrder.product.name',
                    image: '$subOrder.product.image',
                    brand: '$subOrder.product.brand',
                    customerName: {
                        $concat: ['$customer.firstName', ' ', '$customer.lastName'],
                    },
                    orderDate: '$createdAt',
                    price: '$subOrder.price',
                    quantity: '$subOrder.quantity',
                    size: '$subOrder.product.size',
                    paymentMethod: '$transaction.razorpayResponse.paymentMethod',
                    status: '$subOrder.status',
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
