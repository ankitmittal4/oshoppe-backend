/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ColorModel } from '../../models';

const ColorList = ({
    groupNames = [],
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
                        { groupName: { $regex: new RegExp(text, 'i') } },
                        { hexCode: { $regex: new RegExp(text, 'i') } },
                        { ncsCode: { $regex: new RegExp(text, 'i') } },
                    ],
                },
            });
        }
        const groupSearchQuery = [];
        if (groupNames.length) {
            groupSearchQuery.push({
                $match: {
                    $expr: {
                        $and: [
                            {
                                $in: ['$groupName', groupNames],
                            },
                        ],
                    },
                },
            });
        }

        const [data] = await ColorModel.aggregate([
            ...groupSearchQuery,
            ...searchQuery,
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
            message: 'Color list fetched successfully.',
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
        reject(new ApiErrorUtility({ message: 'Error while fetching color list', error }));
    }
});

export default ColorList;
