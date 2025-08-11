/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService } from '../../services';
import { CategoryModel } from '../../models';

export default ({
    categoryId,
    name,
    image,
}) => new Promise(async (resolve, reject) => {
    try {
        let imageName;
        let imageUrl;
        if (image) {
            imageName = `category-image-${Date.now()}`;
            imageUrl = await ImageUploadService(imageName, image);
        }

        const category = await CategoryModel.findOneAndUpdate(
            { _id: categoryId || new CategoryModel()._id },
            { name, image: imageUrl },
            { new: true, upsert: true },
        );

        const message = categoryId
            ? 'Category updated successfully.'
            : 'Category added successfully.';

        resolve(new ApiResponseUtility({ message, data: category }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while processing category.', error }));
    }
});
