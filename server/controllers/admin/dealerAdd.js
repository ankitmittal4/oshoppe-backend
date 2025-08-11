/* eslint-disable no-promise-executor-return */
/* eslint-disable max-len */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService, IdGeneratorService } from '../../services';
import { DealerModel } from '../../models';

export default ({
    dealerId,
    email,
    password,
    occupation,
    firstName,
    lastName,
    shopImage,
    gender,
    dob,
    countryCode,
    phoneNumber,
    alternatePhoneNumber,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
    status,
}) => new Promise(async (resolve, reject) => {
    try {
        let imageUrl;
        if (shopImage) {
            const imageName = `dealer-image-${Date.now()}`;
            imageUrl = await ImageUploadService(imageName, shopImage);
        }

        let updatedDealer;

        if (dealerId) {
            const dealerExists = await DealerModel.findOne({ _id: dealerId });
            if (!dealerExists) {
                return reject(new ApiErrorUtility({ message: 'Dealer not found' }));
            }
            updatedDealer = await DealerModel.findOneAndUpdate(
                {
                    _id: dealerId,
                },
                {
                    email,
                    firstName,
                    lastName,
                    shopImage: imageUrl,
                    occupation,
                    gender,
                    dob,
                    countryCode,
                    phoneNumber,
                    alternatePhoneNumber,
                    addressLine1,
                    addressLine2,
                    landmark,
                    city,
                    state,
                    country,
                    pincode,
                    location: {
                        type: 'Point',
                        coordinates: [longitude || dealerExists.location.coordinates[0], latitude || dealerExists.location.coordinates[1]],
                    },
                    status,
                },
                {
                    new: true,
                },
            );
        } else {
            const emailExists = await DealerModel.findOne({ email: email.toLowerCase(), deleted: false });
            if (emailExists) {
                return reject(new ApiErrorUtility({ message: `Email ${email} is already registered!` }));
            }
            const dealerid = await IdGeneratorService({ type: 'D' });
            updatedDealer = new DealerModel({
                id: dealerid,
                email,
                password,
                firstName,
                lastName,
                shopImage: imageUrl,
                occupation,
                gender,
                dob,
                countryCode,
                phoneNumber,
                alternatePhoneNumber,
                addressLine1,
                addressLine2,
                landmark,
                city,
                state,
                country,
                pincode,
                location: {
                    address: '',
                    coordinates: [longitude, latitude],
                },
                status,
            });
            await updatedDealer.save();
        }

        resolve(new ApiResponseUtility({
            message: dealerId ? 'Dealer updated successfully!' : 'Dealer created successfully!',
            data: updatedDealer,
        }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while updating or creating dealer', error }));
    }
});
