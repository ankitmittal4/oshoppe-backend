/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ServiceLocationModel } from '../../models';

export default ({
    serviceLocationId,
    pincode,
    locationName,
    state,
}) => new Promise(async (resolve, reject) => {
    try {
        const serviceLocation = await ServiceLocationModel.findByIdAndUpdate(serviceLocationId, {
            pincode,
            locationName,
            state,
        }, { new: true });
        if (!serviceLocation) {
            reject(new ApiErrorUtility({ message: 'Service location not found' }));
        }

        resolve(new ApiResponseUtility({ message: 'Service location updated successfully.', data: serviceLocation }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while updating service location.', error }));
    }
});
