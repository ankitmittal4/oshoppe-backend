/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ServiceLocationModel } from '../../models';

const AddServiceLocation = ({
    dealerId,
    pincode,
    locationName,
    state,
}) => new Promise(async (resolve, reject) => {
    try {
        const serviceLocation = await new ServiceLocationModel({
            dealerRef: dealerId,
            pincode,
            locationName,
            state,
        }).save();

        resolve(new ApiResponseUtility({ message: 'Service location added successfully.', data: serviceLocation }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while adding service location.', error }));
    }
});

export default AddServiceLocation;
