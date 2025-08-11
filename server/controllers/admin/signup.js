/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService } from '../../services';
import { AdminModel } from '../../models';
import { SECRET_STRING } from '../../constants';

const AdminSignup = ({
    email,
    password,
    secretKey,
    firstName,
    lastName,
    image,
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
    geoLocationCode,
    status,
    idProofType,
    idProofNumber,
}) => new Promise(async (resolve, reject) => {
    try {
        const emailExists = await AdminModel.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return reject(new ApiErrorUtility({ message: `Email ${email} is already registered!` }));
        }

        if (secretKey !== SECRET_STRING) {
            return reject(new ApiErrorUtility({ message: 'Invalid Authorization' }));
        }

        let imageUrl;
        if (image) {
            const imageName = `admin-image-${Date.now()}`;
            imageUrl = await ImageUploadService(imageName, image);
        }

        const adminObject = new AdminModel({
            email,
            password,
            firstName,
            lastName,
            image: imageUrl,
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
            geoLocationCode,
            status,
            idProofType,
            idProofNumber,
        });
        await adminObject.save();

        const admin = await AdminModel.findById(adminObject._id).select('-password -__v');
        if (!admin) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Something went wrong while registering admin' }));
        }

        resolve(new ApiResponseUtility({ message: 'Admin has signed up successfully!', data: admin }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Invalid Authorization', error }));
    }
});

export default AdminSignup;
