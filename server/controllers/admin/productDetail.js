/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductModel } from '../../models';

const ProductDetail = ({
    productId,
}) => new Promise(async (resolve, reject) => {
    try {
        const [product] = await ProductModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(productId),
                },
            },
            {
                $lookup: {
                    from: 'productdealers',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$productRef', '$$productId'],
                                        },
                                        {
                                            $gt: ['$units', 0],
                                        },
                                        {
                                            $eq: ['$availability', 'Y'],
                                        },
                                        {
                                            $eq: ['$status', 'A'],
                                        },
                                    ],
                                },
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
                            $project: {
                                _id: '$dealer._id',
                                dealerId: {
                                    $ifNull: ['$dealer.id', ''],
                                },
                                firstName: '$dealer.firstName',
                                lastName: '$dealer.lastName',
                                phoneNumber: '$dealer.phoneNumber',
                                city: '$dealer.city',
                                state: '$dealer.state',
                                country: '$dealer.country',
                                pinCode: '$dealer.pincode',
                                addressLine1: '$dealer.addressLine1',
                                status: '$dealer.status',
                            },
                        },
                    ],
                    as: 'productDealer',
                },
            },
            {
                $lookup: {
                    from: 'colors',
                    let: {
                        colourArray: {
                            $map: {
                                input: '$colour',
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
                    _id: '$_id',
                    productId: {
                        $ifNull: ['$id', ''],
                    },
                    name: '$name',
                    type: '$type',
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
                    isExpress: '$isExpress',
                    isTopDeal: '$isTopDeal',
                    dealer: {
                        $ifNull: ['$productDealer', {}],
                    },
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                },
            },
        ]);

        resolve(new ApiResponseUtility({ message: 'Product details fetched successfully.', data: product }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while fetching product details.', error }));
    }
});

export default ProductDetail;
