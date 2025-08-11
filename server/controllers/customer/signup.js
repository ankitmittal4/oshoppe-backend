/* eslint-disable no-promise-executor-return */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService, IdGeneratorService } from '../../services';
import { CustomerModel } from '../../models';

const CustomerSignup = ({
    email,
    password,
    firstName,
    lastName,
    profilePicture,
    occupation,
    gender,
    dob,
    countryCode,
    phoneNumber,
    alternatePhoneNumber,
    status,
}) => new Promise(async (resolve, reject) => {
    try {
        const emailExists = await CustomerModel.findOne({ email: email.toLowerCase(), deleted: false });
        if (emailExists) {
            return reject(new ApiErrorUtility({ message: `Email ${email} is already registered!` }));
        }

        let profilePictureUrl;
        if (profilePicture) {
            const profilePictureName = `admin-image-${Date.now()}`;
            profilePictureUrl = await ImageUploadService(profilePictureName, profilePicture);
        }

        const customerId = await IdGeneratorService({ type: 'C' });

        const customerObject = new CustomerModel({
            id: customerId,
            email,
            password,
            firstName,
            lastName,
            profilePicture: profilePictureUrl,
            occupation,
            gender,
            dob,
            countryCode,
            phoneNumber,
            alternatePhoneNumber,
            status,
        });
        await customerObject.save();

        const customer = await CustomerModel.findById(customerObject._id).select('-password -__v');
        if (!customer) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Something went wrong while registering customer' }));
        }

        resolve(new ApiResponseUtility({ message: 'Your account has been registered successfully with OShoppe. Please login now.', data: customer }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while customer signup', error }));
    }
});

export default CustomerSignup;
