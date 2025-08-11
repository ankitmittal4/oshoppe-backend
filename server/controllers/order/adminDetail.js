/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { SubOrderModel } from '../../models';

export default ({
    subOrderId,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await SubOrderModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(subOrderId),
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
                                phoneNumber: '$phoneNumber',
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
            {
                $lookup: {
                    from: 'orders',
                    let: { orderId: '$orderRef' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$_id', '$$orderId'],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'order',
                },
            },
            {
                $unwind: {
                    path: '$order',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'customers',
                    let: { customerId: '$order.customerRef' },
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
                    from: 'addresses',
                    let: { addressId: '$order.addressRef' },
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
                    let: { orderId: '$orderRef' },
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
                    customerInfo: {
                        customerId: '$customer.id',
                        name: {
                            $concat: ['$customer.firstName', ' ', '$customer.lastName'],
                        },
                        phoneNumber: '$customer.phoneNumber',
                        address: '$address.address',
                        city: '$address.city',
                        state: '$address.state',
                        country: '$address.country',
                        pincode: '$address.pincode',
                    },
                    orderInfo: {
                        subOrderId: '$_id',
                        subOrderFormatId: '$id',
                        orderId: '$order._id',
                        dealerName: {
                            $concat: ['$dealer.firstName', ' ', '$dealer.lastName'],
                        },
                        dealerPhoneNumber: '$dealer.phoneNumber',
                        dealerId: '$dealer._id',
                        orderDate: '$createdAt',
                        deliveryDate: '$shippingDate',
                        totalAmount: {
                            $multiply: [
                                '$price',
                                '$quantity',
                            ],
                        },
                        price: '$price',
                        numberOfProducts: '$quantity',
                        status: '$status',
                        paymentMode: '$transaction.razorpayResponse.paymentMethod',
                    },
                    productInfo: {
                        productId: '$product.id',
                        name: '$product.name',
                        image: '$product.image1',
                        brand: '$product.brand',
                        size: '$product.quantity',
                        quantity: '$quantity',
                        price: '$price',
                    },
                },
            },
        ]);

        resolve(new ApiResponseUtility({
            message: 'Sub order details fetched successfully.',
            data,
        }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while fetching details of sub order.', error }));
    }
});
