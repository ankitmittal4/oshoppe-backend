/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AddressModel } from '../../models';

const DeleteAddress = ({
    id,
    addressId,
}) => new Promise(async (resolve, reject) => {
    try {
        const isDefaultAddress = await AddressModel.findOne({
            _id: addressId,
            customerRef: id,
            isDefault: true,
        });
        if (isDefaultAddress) {
            return reject(new ApiErrorUtility({ message: 'You cannot delete default address.' }));
        }

        const address = await AddressModel.findOneAndUpdate({
            _id: addressId,
            customerRef: id,
            deleted: false,
        }, {
            $set: {
                deleted: true,
            },
        });

        if (!address) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Address not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Address deleted successfully.', data: address }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting address.', error }));
    }
});

export default DeleteAddress;
