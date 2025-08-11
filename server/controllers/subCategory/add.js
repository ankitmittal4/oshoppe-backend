/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService } from '../../services';
import { CategoryModel, SubCategoryModel } from '../../models';

export default ({
    categoryId,
    subCategoryId,
    name,
    image,
}) => new Promise(async (resolve, reject) => {
    try {
        if (!categoryId) {
            return reject(new ApiErrorUtility({ message: 'categoryId is required' }));
        }

        const category = await CategoryModel.findById(categoryId);
        let imageName;
        let imageUrl;
        if (image) {
            imageName = `subCategory-image-${Date.now()}`;
            imageUrl = await ImageUploadService(imageName, image);
        }

        const subCategory = await SubCategoryModel.findOneAndUpdate(
            { _id: subCategoryId || new SubCategoryModel()._id },
            {
                name, image: imageUrl, categoryRef: categoryId, categoryName: category.name,
            },
            { new: true, upsert: true },
        );

        const message = subCategoryId
            ? 'Sub category updated successfully.'
            : 'Sub category added successfully.';

        resolve(new ApiResponseUtility({ message, data: subCategory }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while processing sub category.', error }));
    }
});
