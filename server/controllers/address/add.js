/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AddressModel } from '../../models';

const AddAdress = ({
    id,
    address,
    addressType,
    landmark,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
}) => new Promise(async (resolve, reject) => {
    try {
        const addressExists = await AddressModel.findOne({
            customerRef: id,
        });

        const addedAddress = await new AddressModel({
            customerRef: id,
            address,
            addressType,
            landmark,
            city,
            state,
            country,
            pincode,
            isDefault: !addressExists,
            location: {
                address: '',
                coordinates: [longitude, latitude],
            },
        }).save();

        if (!addedAddress) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Something went wrong while adding address' }));
        }

        resolve(new ApiResponseUtility({ message: 'Address added successfully!', data: addedAddress }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while adding address', error }));
    }
});

export default AddAdress;
