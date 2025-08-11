/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductModel, WishlistModel } from '../../models';

export default ({
    id,
    limit = 10,
    page = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const wishlist = await WishlistModel.findOne({
            customerRef: id,
        });
        if (!wishlist) {
            return reject(new ApiErrorUtility({ message: 'Wishlist is empty' }));
        }
        console.log(wishlist);
        const [data] = await ProductModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ['$deleted', false],
                            },
                            {
                                $in: ['$_id', wishlist.wishlist],
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: '$_id',
                    productId: {
                        $ifNull: ['$id', ''],
                    },
                    name: '$name',
                    shortDescription: '$shortDescription',
                    longDescription: '$longDescription',
                    quantity: '$quantity',
                    category: '$category',
                    subCategory: '$subCategory',
                    brand: '$brand',
                    weight: '$weight',
                    length: '$length',
                    width: '$width',
                    height: '$height',
                    manufacturingDate: '$manufacturingDate',
                    expiryDate: '$expiryDate',
                    specialFeature: '$specialFeature',
                    mrp: '$mrp',
                    sellingPrice: '$sellingPrice',
                    discountPercentage: {
                        $multiply: [
                            {
                                $divide: [
                                    { $subtract: ['$mrp', '$sellingPrice'] },
                                    '$mrp',
                                ],
                            },
                            100,
                        ],
                    },
                    tax: '$tax',
                    images: {
                        $filter: {
                            input: ['$image1', '$image2', '$image3', '$image4', '$image5'],
                            as: 'image',
                            cond: { $ne: ['$$image', null] },
                        },
                    },
                    warranty: '$warranty',
                    colour: '$colourDetails',
                    finishType: '$finishType',
                    about: '$about',
                    status: '$status',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
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
            message: 'Wishlist fetched successfully.',
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
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching wishlist.', error }));
    }
});
