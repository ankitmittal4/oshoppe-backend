/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CartModel } from '../../models';

const CartDetail = ({
    id,
    limit = 10,
    page = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await CartModel.aggregate([
            {
                $match: {
                    customerRef: new Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: 'productdealers',
                    let: { productId: '$productRef', dealerId: '$dealerRef' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$productRef', '$$productId'],
                                        },
                                        {
                                            $eq: ['$dealerRef', '$$dealerId'],
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
                                from: 'colors',
                                let: {
                                    colourArray: {
                                        $map: {
                                            input: '$product.colour',
                                            as: 'col',
                                            in: { $toObjectId: '$$col' },
                                        },
                                    },
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $in: ['$_id', '$$colourArray'] },
                                        },
                                    },
                                ],
                                as: 'colourDetails',
                            },
                        },
                        {
                            $project: {
                                _id: '$productRef',
                                dealerRef: '$dealerRef',
                                name: '$product.name',
                                brand: '$product.brand',
                                colour: '$colourDetails',
                                finishType: '$product.finishType',
                                size: '$product.quantity',
                                mrp: '$product.mrp',
                                sellingPrice: '$product.sellingPrice',
                                discountPercentage: {
                                    $multiply: [
                                        {
                                            $divide: [
                                                { $subtract: ['$product.mrp', '$product.sellingPrice'] },
                                                '$product.mrp',
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                images: {
                                    $filter: {
                                        input: ['$product.image1', '$product.image2', '$product.image3', '$product.image4', '$product.image5'],
                                        as: 'image',
                                        cond: { $ne: ['$$image', null] },
                                    },
                                },
                            },
                        },
                    ],
                    as: 'productDetail',
                },
            },
            {
                $unwind: {
                    path: '$productDetail',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: '$_id',
                    productId: '$productDetail._id',
                    name: '$productDetail.name',
                    dealerId: '$productDetail.dealerRef',
                    quantity: '$quantity',
                    brand: '$productDetail.brand',
                    colour: '$productDetail.colour',
                    finishType: '$productDetail.finishType',
                    size: '$productDetail.quantity',
                    mrp: '$productDetail.mrp',
                    sellingPrice: '$productDetail.sellingPrice',
                    discountPercentage: '$productDetail.discountPercentage',
                    images: '$productDetail.images',
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
            message: 'Cart details fetched successfully.',
            data: {
                products: ((data || {}).list || []),
                page,
                limit,
                total: (((data || {}).total || {}).count || 0),
                size: ((data || {}).list || []).length,
                hasMore: (page * limit) < (((data || {}).total || {}).count || 0),
            },
        }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while fetching cart details.', error }));
    }
});

export default CartDetail;
