/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductModel, CustomerModel, DealerModel } from '../../models';

export default ({
    id,
}) => new Promise(async (resolve, reject) => {
    try {
        const numberOfProducts = await ProductModel.countDocuments({
            deleted: false,
        });
        const numberOfCustomers = await CustomerModel.countDocuments({
            deleted: false,
        });
        const numberOfDealers = await DealerModel.countDocuments({
            deleted: false,
        });

        resolve(new ApiResponseUtility({
            message: 'Dashboard fetched successfully.',
            data: {
                numberOfProducts,
                numberOfCustomers,
                numberOfDealers,
            },
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching dashboard', error }));
    }
});
