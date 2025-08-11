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
                                addressLine1: '$addressLine1',
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
                    subOrderId: '$_id',
                    subOrderFormatId: '$id',
                    orderId: '$order._id',
                    numberOfProducts: '$quantity',
                    orderDate: '$createdAt',
                    deliveryDate: '$shippingDate',
                    status: '$status',
                    name: '$product.name',
                    image: '$product.image1',
                    totalAmount: {
                        $multiply: [
                            '$price',
                            '$quantity',
                        ],
                    },
                    price: '$price',
                    deliveryCharges: '$order.deliveryCharges',
                    customerName: {
                        $concat: ['$customer.firstName', ' ', '$customer.lastName'],
                    },
                    phoneNumber: '$customer.phoneNumber',
                    email: '$customer.email',
                    address: '$address.addressLine1',
                    city: '$address.city',
                    state: '$address.state',
                    country: '$address.country',
                    pincode: '$address.pincode',
                    landmark: '$address.landmark',
                    dealerShopName: {
                        $concat: ['$dealer.firstName', ' ', '$dealer.lastName'],
                    },
                    dealerShopAddress: '$dealer.addressLine1',
                    invoiceId: '$transaction._id',
                    invoiceDate: '$transaction.createdAt',
                    paymentMode: '$transaction.razorpayResponse.paymentMethod',
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
