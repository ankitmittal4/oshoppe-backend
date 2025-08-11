/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AdvisorModel } from '../../models';

export default ({
    id,
}) => new Promise(async (resolve, reject) => {
    try {
        const advisorDetail = await AdvisorModel.findOne({
            customerRef: id,
            deleted: false,
        });
        if (!advisorDetail) {
            return reject(new ApiErrorUtility({ message: 'Detail not found' }));
        }

        return resolve(new ApiResponseUtility({
            message: 'Advisor details fetched successfully.',
            data: advisorDetail,
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while fetching advisor details.', error }));
    }
});
