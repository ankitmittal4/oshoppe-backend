/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService } from '../../services';
import { BrandModel } from '../../models';

export default ({
    brandId,
    name,
    image,
    category,
    subCategories = [],
    colors = [],
}) => new Promise(async (resolve, reject) => {
    try {
        let imageName;
        let imageUrl;
        if (typeof image === 'string') {
            imageUrl = undefined;
        } else if (image) {
            imageName = `brand-image-${Date.now()}`;
            imageUrl = await ImageUploadService(imageName, image);
        }

        const brand = await BrandModel.findOneAndUpdate(
            { _id: brandId || new BrandModel()._id },
            {
                name,
                image: imageUrl,
                categoryRef: category,
                subCategoryRefs: subCategories.length ? JSON.parse(subCategories) : undefined,
                colorRefs: colors.length ? JSON.parse(colors) : undefined,
            },
            { new: true, upsert: true },
        );

        const message = brandId
            ? 'Brand updated successfully.'
            : 'Brand added successfully.';

        resolve(new ApiResponseUtility({ message, data: brand }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while processing brand.', error }));
    }
});
