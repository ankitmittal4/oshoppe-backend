/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { GetLocationService } from '../../services';

export default ({
    latitude, longitude,
}) => new Promise(async (resolve, reject) => {
    try {
        const locationDetails = await GetLocationService({
            latitude,
            longitude,
        });

        return resolve(new ApiResponseUtility({
            message: 'Location details fetched successfully',
            data: locationDetails,
        }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while fetching location details', error }));
    }
});
