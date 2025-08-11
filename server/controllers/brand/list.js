/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { BrandModel } from '../../models';

export default ({
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
                    ],
                },
            });
        }
        const [data] = await BrandModel.aggregate([
            {
                $match: {
                    deleted: false,
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    let: {
                        categoryId: '$categoryRef',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$categoryId'] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: '$_id',
                                name: '$name',
                                image: '$image',
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
                        subCategoryArray: {
                            $map: {
                                input: '$subCategoryRefs',
                                as: 'col',
                                in: { $toObjectId: '$$col' },
                            },
                        },
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$subCategoryArray'] },
                            },
                        },
                        {
                            $project: {
                                _id: '$_id',
                                name: '$name',
                                image: '$image',
                            },
                        },
                    ],
                    as: 'subCategory',
                },
            },
            {
                $lookup: {
                    from: 'colors',
                    let: {
                        colourArray: {
                            $map: {
                                input: '$colorRefs',
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
                        {
                            $project: {
                                _id: '$_id',
                                name: '$name',
                                hexCode: '$hexCode',
                                ncsCode: '$ncsCode',
                                groupName: '$groupName',
                            },
                        },
                    ],
                    as: 'colourDetails',
                },
            },
            ...searchQuery,
            {
                $project: {
                    _id: '$_id',
                    name: '$name',
                    image: '$image',
                    category: '$category.name',
                    categoryId: '$category._id',
                    subCategories: '$subCategory',
                    colors: '$colourDetails',
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
            message: 'Brands fetched successfully.',
            data: {
                brands: ((data || {}).list || []),
                page,
                limit,
                total: (((data || {}).total || {}).count || 0),
                size: ((data || {}).list || []).length,
                hasMore: (page * limit) < (((data || {}).total || {}).count || 0),
            },
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching brands.', error }));
    }
});
