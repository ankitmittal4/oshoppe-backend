/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ServiceLocationModel } from '../../models';

const DeleteServiceLocation = ({
    serviceLocationId,
}) => new Promise(async (resolve, reject) => {
    try {
        const serviceLocation = await ServiceLocationModel.findOneAndUpdate({
            _id: serviceLocationId,
            deleted: false,
        }, {
            $set: {
                deleted: true,
            },
        });

        if (!serviceLocation) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Service location not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Service location deleted successfully.', data: serviceLocation }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting service location.', error }));
    }
});

export default DeleteServiceLocation;
