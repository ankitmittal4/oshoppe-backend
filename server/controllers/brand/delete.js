/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { BrandModel } from '../../models';

export default ({
    brandId,
}) => new Promise(async (resolve, reject) => {
    try {
        const brand = await BrandModel.findOneAndDelete({
            _id: brandId,
        });

        if (!brand) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Brand not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Brand deleted successfully.' }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting brand.', error }));
    }
});
