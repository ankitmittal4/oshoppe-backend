/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AddressModel, ProductModel } from '../../models';

const ProductDetail = ({
    id,
    productId,
    pincode = '',
}) => new Promise(async (resolve, reject) => {
    try {
        const customerAddress = await AddressModel.findOne({
            customerRef: id,
            isDefault: true,
        });
        const [data] = await ProductModel.aggregate([
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
                                from: 'servicelocations',
                                let: { dealerId: '$dealerRef' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: ['$deleted', false],
                                                    },
                                                    {
                                                        $eq: ['$pincode', customerAddress ? customerAddress.pincode : pincode],
                                                    },
                                                    {
                                                        $eq: ['$dealerRef', '$$dealerId'],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: 'dealerServiceLocations',
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $gt: [
                                                {
                                                    $size: '$dealerServiceLocations',
                                                },
                                                0,
                                            ],
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
                                                    {
                                                        $eq: ['$status', 'A'],
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
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $gt: [
                                                {
                                                    $size: '$dealer',
                                                },
                                                0,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        // {
                        //     $unwind: {
                        //         path: '$dealer',
                        //         preserveNullAndEmptyArrays: true,
                        //     },
                        // },
                        {
                            $project: {
                                _id: {
                                    $first: '$dealer._id',
                                },
                                firstName: {
                                    $first: '$dealer.firstName',
                                },
                                lastName: {
                                    $first: '$dealer.lastName',
                                },
                                phoneNumber: {
                                    $first: '$dealer.phoneNumber',
                                },
                                city: {
                                    $first: '$dealer.city',
                                },
                                state: {
                                    $first: '$dealer.state',
                                },
                                country: {
                                    $first: '$dealer.country',
                                },
                                pinCode: {
                                    $first: '$dealer.pinCode',
                                },
                                addressLine1: {
                                    $first: '$dealer.addressLine1',
                                },
                                dealerServiceLocations: '$dealerServiceLocations',
                            },
                        },
                    ],
                    as: 'productDealer',
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    let: {
                        categoryId: '$category',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$categoryId'] },
                            },
                        },
                    ],
                    as: 'category',
                },
            },
            {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'subcategories',
                    let: {
                        subCategoryId: '$subCategory',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$subCategoryId'] },
                            },
                        },
                    ],
                    as: 'subCategory',
                },
            },
            {
                $unwind: {
                    path: '$subCategory',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'brands',
                    let: {
                        brandId: '$brand',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$brandId'] },
                            },
                        },
                    ],
                    as: 'brand',
                },
            },
            {
                $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true,
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
                $lookup: {
                    from: 'wishlists',
                    let: { productId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$customerRef', new Types.ObjectId(id)],
                                        },
                                        {
                                            $in: ['$$productId', '$wishlist'],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'wishlist',
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
                    category: '$category.name',
                    subCategory: '$subCategory.name',
                    brand: '$brand.name',
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
                        $round: [
                            {
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
                            2,
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
                        $ifNull: ['$productDealer', []],
                    },
                    isWishlisted: {
                        $cond: {
                            if: {
                                $gt: [{ $size: '$wishlist' }, 0],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                },
            },
        ]);

        if (!data) {
            reject(new ApiErrorUtility({ message: 'No product found' }));
        }

        resolve(new ApiResponseUtility({
            message: 'Product details fetched successfully.',
            data,
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching product details.', error }));
    }
});

export default ProductDetail;
