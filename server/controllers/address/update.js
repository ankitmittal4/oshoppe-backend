/* eslint-disable max-len */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AddressModel } from '../../models';

const UpdateAddress = ({
    id,
    addressId,
    address,
    addressType,
    landmark,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
    setDefault,
}) => new Promise(async (resolve, reject) => {
    try {
        if (setDefault) {
            await AddressModel.updateMany({
                customerRef: id,
                deleted: false,
            }, {
                $set: {
                    isDefault: false,
                },
            });
        }

        const addedAddress = await AddressModel.findOne({
            _id: addressId,
            customerRef: id,
            deleted: false,
        });

        if (!addedAddress) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Address not found.' }));
        }

        const updatedAddress = await AddressModel.findOneAndUpdate({
            _id: addressId,
            customerRef: id,
            deleted: false,
        }, {
            $set: {
                address,
                addressType,
                landmark,
                city,
                state,
                country,
                pincode,
                location: {
                    type: 'Point',
                    coordinates: [longitude || addedAddress.location.coordinates[0], latitude || addedAddress.location.coordinates[1]],
                },
                isDefault: setDefault,
            },
        }, { new: true });

        if (!updatedAddress) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Address not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Address updated successfully.', data: updatedAddress }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while updating address.', error }));
    }
});

export default UpdateAddress;
