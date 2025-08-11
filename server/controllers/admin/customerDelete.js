/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CustomerModel } from '../../models';

export default ({
    customerId,
}) => new Promise(async (resolve, reject) => {
    try {
        const customer = await CustomerModel.findOneAndUpdate({
            _id: customerId,
            deleted: false,
        }, {
            $set: {
                deleted: true,
            },
        });

        if (!customer) {
            return reject(new ApiErrorUtility({ statusCode: 501, message: 'Customer not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Customer deleted successfully.' }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting customer.', error }));
    }
});
