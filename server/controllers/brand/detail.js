/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { Types } from 'mongoose';
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { BrandModel } from '../../models';

export default ({
    brandId,
}) => new Promise(async (resolve, reject) => {
    try {
        const [data] = await BrandModel.aggregate([
            {
                $match: {
                    deleted: false,
                    _id: new Types.ObjectId(brandId),
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
            {
                $project: {
                    _id: '$_id',
                    name: '$name',
                    image: '$image',
                    category: '$category',
                    subCategories: '$subCategory',
                    colors: '$colourDetails',
                },
            },
        ]);

        resolve(new ApiResponseUtility({
            message: 'Brand details fetched successfully.',
            data,
        }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while fetching brand details.', error }));
    }
});
