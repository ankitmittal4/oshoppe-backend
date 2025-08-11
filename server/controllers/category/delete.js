/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CategoryModel, SubCategoryModel } from '../../models';

export default ({
    categoryId,
}) => new Promise(async (resolve, reject) => {
    try {
        const category = await CategoryModel.findOneAndDelete({
            _id: categoryId,
        });
        if (!category) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Category not found.' }));
        }
        await SubCategoryModel.deleteMany({
            categoryRef: categoryId,
        });

        resolve(new ApiResponseUtility({ message: 'Category deleted successfully.' }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting category.', error }));
    }
});
