/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { DealerModel } from '../../models';

export default ({
    id,
    dealerId,
}) => new Promise(async (resolve, reject) => {
    try {
        const dealer = await DealerModel.findOneAndUpdate({
            _id: dealerId,
            deleted: false,
        }, {
            $set: {
                deleted: true,
            },
        });

        if (!dealer) {
            return reject(new ApiErrorUtility({ statusCode: 501, message: 'Dealer not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Dealer deleted successfully.' }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting dealer.', error }));
    }
});
