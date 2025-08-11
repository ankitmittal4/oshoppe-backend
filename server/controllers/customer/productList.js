/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductModel } from '../../models';

const ProductList = ({
    id,
    text,
    limit = 10,
    page = 1,
    minimumPrice,
    maximumPrice,
    brands,
    discount,
    applicationType,
    finishType,
    paintType,
    highToLowPriceSort,
    lowToHighPriceSort,
    newestArrivalsSort,
    pincode = '',
    category = [],
    subCategory = [],
    oshoppeExpress,
}) => new Promise(async (resolve, reject) => {
    try {
        const searchQuery = [];
        if (text) {
            const searchText = text.toLowerCase().replace(/\s+/g, '').replace(/(es|s)$/, '');
            searchQuery.push({
                $match: {
                    $or: [
                        { name: { $regex: new RegExp(searchText, 'i') } },
                        { shortDescription: { $regex: new RegExp(searchText, 'i') } },
                        { longDescription: { $regex: new RegExp(searchText, 'i') } },
                        { specialFeature: { $regex: new RegExp(searchText, 'i') } },
                        { combinedText: { $regex: new RegExp(searchText, 'i') } },
                    ],
                },
            });
        }

        const priceFilter = [];
        if (minimumPrice && maximumPrice) {
            priceFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $gte: ['$sellingPrice', minimumPrice],
                            },
                            {
                                $lte: ['$sellingPrice', maximumPrice],
                            },
                        ],
                    },
                },
            });
        }

        const brandFilter = [];
        if (brands) {
            brandFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $in: ['$brand', brands],
                            },
                        ],
                    },
                },
            });
        }

        const discountFilter = [];
        if (discount) {
            discountFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $gte: ['$discountPercentage', discount],
                            },
                        ],
                    },
                },
            });
        }

        const applicationTypeFilter = [];
        if (applicationType) {
            applicationTypeFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $in: ['$group', applicationType],
                            },
                        ],
                    },
                },
            });
        }

        const finishTypeFilter = [];
        if (finishType) {
            finishTypeFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $in: ['$finishType', finishType],
                            },
                        ],
                    },
                },
            });
        }

        const paintTypeFilter = [];
        if (paintType) {
            paintTypeFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $in: ['$type', paintType],
                            },
                        ],
                    },
                },
            });
        }

        const pincodeFilter = [];
        if (pincode) {
            pincodeFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $gt: [{ $size: '$dealer' }, 0],
                            },
                        ],
                    },
                },
            });
        }

        const categoryFilter = [];
        if (category.length) {
            const categoryIds = category.map((cat) => new Types.ObjectId(cat));
            categoryFilter.push({
                $match: {
                    $expr: {
                        $or: [
                            {
                                $in: ['$category', categoryIds],
                            },
                        ],
                    },
                },
            });
        }

        const subCategoryFilter = [];
        if (subCategory.length) {
            const subCategoryIds = subCategory.map((subCat) => new Types.ObjectId(subCat));
            subCategoryFilter.push({
                $match: {
                    $expr: {
                        $or: [
                            {
                                $in: ['$subCategory', subCategoryIds],
                            },
                        ],
                    },
                },
            });
        }

        const expressFilter = [];
        if (oshoppeExpress) {
            expressFilter.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ['$isExpress', true],
                            },
                        ],
                    },
                },
            });
        }

        const sortFilter = {};
        if (highToLowPriceSort) {
            sortFilter.$sort = {
                sellingPrice: -1,
            };
        } else if (lowToHighPriceSort) {
            sortFilter.$sort = {
                sellingPrice: 1,
            };
        } else if (newestArrivalsSort) {
            sortFilter.$sort = {
                createdAt: -1,
            };
        } else {
            sortFilter.$sort = {
                createdAt: -1,
            };
        }

        const [data] = await ProductModel.aggregate([
            {
                $match: {
                    deleted: false,
                    status: 'A',
                },
            },
            ...categoryFilter,
            ...subCategoryFilter,
            ...expressFilter,
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
                $addFields: {
                    combinedText: {
                        $concat: [
                            { $ifNull: ['$name', ''] },
                            { $ifNull: ['$shortDescription', ''] },
                            { $ifNull: ['$longDescription', ''] },
                            { $ifNull: ['$category.name', ''] },
                            { $ifNull: ['$subCategory.name', ''] },
                            { $ifNull: ['$brand.name', ''] },
                            { $ifNull: ['$specialFeature', ''] },
                            {
                                $reduce: {
                                    input: { $ifNull: ['$about', []] },
                                    initialValue: '',
                                    in: { $concat: ['$$value', ' ', '$$this'] },
                                },
                            },
                            {
                                $reduce: {
                                    input: { $ifNull: ['$searchTags', []] },
                                    initialValue: '',
                                    in: { $concat: ['$$value', ' ', '$$this'] },
                                },
                            },
                        ],
                    },
                },
            },
            {
                $addFields: {
                    combinedText: {
                        $replaceAll: { input: '$combinedText', find: ' ', replacement: '' },
                    },
                },
            },
            ...searchQuery,
            ...priceFilter,
            ...brandFilter,
            ...applicationTypeFilter,
            ...finishTypeFilter,
            ...paintTypeFilter,
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
                                                        $eq: ['$pincode', pincode],
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
                                    // {
                                    //     $geoNear: {
                                    //         near: { type: 'Point', coordinates: [customerAddress.location.coordinates[0], customerAddress.location.coordinates[1]] },
                                    //         distanceField: 'distance',
                                    //         key: 'location',
                                    //         maxDistance: 10000,
                                    //         spherical: true,
                                    //     },
                                    // },
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
                        // {
                        //     $match: {
                        //         $expr: {
                        //             $and: [
                        //                 {
                        //                     $gt: [
                        //                         {
                        //                             $size: '$dealer.distance',
                        //                         },
                        //                         0,
                        //                     ],
                        //                 },
                        //             ],
                        //         },
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
                    dealer: '$productDealer',
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
            ...pincodeFilter,
            ...discountFilter,
            sortFilter,
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
            }]);

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
