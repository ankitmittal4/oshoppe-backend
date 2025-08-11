/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CustomerModel } from '../../models';

const CustomerDetail = ({
    id,
}) => new Promise(async (resolve, reject) => {
    try {
        const customerExists = await CustomerModel.findById(id).select('-password -__v');
        if (!customerExists) {
            return reject(new ApiErrorUtility({ message: 'Account not found' }));
        }

        return resolve(new ApiResponseUtility({
            message: 'Customer details fetched successfully',
            data: customerExists,
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching customer details', error }));
    }
});

export default CustomerDetail;
