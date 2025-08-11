/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductModel } from '../../models';

const ProductList = ({
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

        const [data] = await ProductModel.aggregate([
            {
                $match: {
                    deleted: false,
                },
            },
            ...searchQuery,
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
                            $lookup: {
                                from: 'servicelocations',
                                let: { dealerId: '$dealer._id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: ['$dealerRef', '$$dealerId'],
                                                    },
                                                    // {
                                                    //     $eq: ['$deleted', false],
                                                    // },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: 'serviceLocation',
                            },
                        },
                        {
                            $project: {
                                _id: '$dealer._id',
                                dealerId: {
                                    $ifNull: ['$dealer.id', ''],
                                },
                                email: '$dealer.email',
                                firstName: '$dealer.firstName',
                                lastName: '$dealer.lastName',
                                phoneNumber: '$dealer.phoneNumber',
                                city: '$dealer.city',
                                state: '$dealer.state',
                                country: '$dealer.country',
                                addressLine1: '$dealer.addressLine1',
                                shopImage: '$dealer.shopImage',
                                occupation: '$dealer.occupation',
                                gender: '$dealer.gender',
                                dob: '$dealer.dob',
                                countryCode: '$dealer.countryCode',
                                alternatePhoneNumber: '$dealer.alternatePhoneNumber',
                                addressLine2: '$dealer.addressLine2',
                                landmark: '$dealer.landmark',
                                pincode: '$dealer.pincode',
                                geoLocationCode: '$dealer.geoLocationCode',
                                status: '$dealer.status',
                                createdAt: '$dealer.createdAt',
                                serviceLocation: '$serviceLocation',
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
                $project: {
                    _id: '$_id',
                    productId: {
                        $ifNull: ['$id', ''],
                    },
                    name: '$name',
                    shortDescription: '$shortDescription',
                    longDescription: '$longDescription',
                    quantity: '$quantity',
                    categoryId: '$category._id',
                    category: '$category.name',
                    subCategoryId: '$subCategory._id',
                    subCategory: '$subCategory.name',
                    brandId: '$brand._id',
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
                    isExpress: '$isExpress',
                    about: '$about',
                    status: '$status',
                    dealer: {
                        $ifNull: ['$productDealer', {}],
                    },
                    searchTags: '$searchTags',
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
