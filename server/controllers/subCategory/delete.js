/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { SubCategoryModel } from '../../models';

export default ({
    subCategoryId,
}) => new Promise(async (resolve, reject) => {
    try {
        const subCategory = await SubCategoryModel.findOneAndDelete({
            _id: subCategoryId,
        });

        if (!subCategory) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Sub category not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Sub category deleted successfully.' }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting sub category.', error }));
    }
});
