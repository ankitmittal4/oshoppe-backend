/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CustomerModel } from '../../models';

const CustomerUpdate = ({
    id, firstName, lastName, email, gender, dob, alternatePhoneNumber,
}) => new Promise(async (resolve, reject) => {
    try {
        const customerExists = await CustomerModel.findOne({ _id: id });
        if (!customerExists) {
            return reject(new ApiErrorUtility({ message: 'Account not found' }));
        }

        const updatedCustomer = await CustomerModel.findByIdAndUpdate(id, {
            firstName,
            lastName,
            alternatePhoneNumber,
            email,
            gender,
            dob,
        }, {
            new: true,
        });

        return resolve(new ApiResponseUtility({
            message: 'Customer profile updated successfully',
            data: updatedCustomer,
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while updating customer profile.', error }));
    }
});

export default CustomerUpdate;
