/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductDealerModel } from '../../models';

const ProductList = ({
    id,
    text,
    limit = 10,
    page = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const searchQuery = [];
        if (text) {
            searchQuery.push({
                $match: {
                    $or: [
                        { name: { $regex: new RegExp(text, 'i') } },
                        { shortDescription: { $regex: new RegExp(text, 'i') } },
                        { longDescription: { $regex: new RegExp(text, 'i') } },
                        { group: { $regex: new RegExp(text, 'i') } },
                        { subGroup: { $regex: new RegExp(text, 'i') } },
                        { brand: { $regex: new RegExp(text, 'i') } },
                        { specialFeature: { $regex: new RegExp(text, 'i') } },
                    ],
                },
            });
        }

        const [data] = await ProductDealerModel.aggregate([
            {
                $match: {
                    dealerRef: new Types.ObjectId(id),
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
                                        {
                                            $eq: ['$deleted', false],
                                        },
                                    ],
                                },
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
                $project: {
                    _id: '$product._id',
                    productId: {
                        $ifNull: ['$product.id', ''],
                    },
                    name: '$product.name',
                    type: '$product.type',
                    units: '$units',
                    availability: '$availability',
                    shortDescription: '$product.shortDescription',
                    longDescription: '$product.longDescription',
                    quantity: '$product.quantity',
                    group: '$product.group',
                    subGroup: '$product.subGroup',
                    brand: '$product.brand',
                    weight: '$product.weight',
                    length: '$product.length',
                    width: '$product.width',
                    height: '$product.height',
                    manufacturingDate: '$product.manufacturingDate',
                    expiryDate: '$product.expiryDate',
                    specialFeature: '$product.specialFeature',
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
                    tax: '$product.tax',
                    images: {
                        $filter: {
                            input: ['$product.image1', '$product.image2', '$product.image3', '$product.image4', '$product.image5'],
                            as: 'image',
                            cond: { $ne: ['$$image', null] },
                        },
                    },
                    warranty: '$product.warranty',
                    colour: '$product.colourDetails',
                    finishType: '$product.finishType',
                    about: '$product.about',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                },
            },
            ...searchQuery,
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
            message: 'Product list fetched successfully.',
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
        reject(new ApiErrorUtility({ message: 'Error while fetching products', error }));
    }
});

export default ProductList;
