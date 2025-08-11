/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ImageUploadService, IdGeneratorService } from '../../services';
import { ProductModel } from '../../models';

const ProductUpdate = ({
    productId,
    name,
    shortDescription,
    longDescription,
    quantity,
    category,
    subCategory,
    brand,
    brandImage,
    weight,
    length,
    width,
    height,
    manufacturingDate,
    expiryDate,
    specialFeature,
    mrp,
    sellingPrice,
    tax,
    image1,
    image2,
    image3,
    image4,
    image5,
    warranty,
    colour = [],
    finishType,
    status,
    about = [],
    isTopDeal,
    isExpress,
    searchTags = [],
}) => new Promise(async (resolve, reject) => {
    try {
        let imageUrl1; let imageUrl2; let imageUrl3; let imageUrl4; let imageUrl5; let
            brandImageUrl;

        if (image1) {
            const imageName = `product-image-${Date.now()}`;
            imageUrl1 = await ImageUploadService(imageName, image1);
        }
        if (image2) {
            const imageName = `product-image-${Date.now()}`;
            imageUrl2 = await ImageUploadService(imageName, image2);
        }
        if (image3) {
            const imageName = `product-image-${Date.now()}`;
            imageUrl3 = await ImageUploadService(imageName, image3);
        }
        if (image4) {
            const imageName = `product-image-${Date.now()}`;
            imageUrl4 = await ImageUploadService(imageName, image4);
        }
        if (image5) {
            const imageName = `product-image-${Date.now()}`;
            imageUrl5 = await ImageUploadService(imageName, image5);
        }
        if (brandImage) {
            const imageName = `productBrand-image-${Date.now()}`;
            brandImageUrl = await ImageUploadService(imageName, brandImage);
        }

        let updatedProduct;

        if (productId) {
            // Use upsert to update the product or create a new one if it doesn't exist
            updatedProduct = await ProductModel.findOneAndUpdate(
                { _id: productId },
                {
                    $set: {
                        name,
                        shortDescription,
                        longDescription,
                        quantity,
                        category,
                        subCategory,
                        brand,
                        brandImage: brandImageUrl,
                        weight,
                        length,
                        width,
                        height,
                        manufacturingDate,
                        expiryDate,
                        specialFeature,
                        mrp,
                        sellingPrice,
                        tax,
                        image1: imageUrl1,
                        image2: imageUrl2,
                        image3: imageUrl3,
                        image4: imageUrl4,
                        image5: imageUrl5,
                        warranty,
                        colour: colour.length ? JSON.parse(colour) : undefined,
                        finishType,
                        status,
                        about: about.length ? JSON.parse(about) : undefined,
                        searchTags: searchTags.length ? JSON.parse(searchTags) : undefined,
                        isTopDeal,
                        isExpress,
                    },
                },
                { new: true },
            );
            if (!updatedProduct) {
                reject(new ApiErrorUtility({ message: 'Product not found' }));
            }
        } else {
            // Create a new product if productId is not provided
            const productid = await IdGeneratorService({ type: 'P' });
            updatedProduct = await ProductModel.create({
                id: productid,
                name,
                shortDescription,
                longDescription,
                quantity,
                category,
                subCategory,
                brand,
                brandImage: brandImageUrl,
                weight,
                length,
                width,
                height,
                manufacturingDate,
                expiryDate,
                specialFeature,
                mrp,
                sellingPrice,
                tax,
                image1: imageUrl1,
                image2: imageUrl2,
                image3: imageUrl3,
                image4: imageUrl4,
                image5: imageUrl5,
                warranty,
                colour: colour.length ? JSON.parse(colour) : undefined,
                finishType,
                status,
                about: about.length ? JSON.parse(about) : undefined,
                searchTags: searchTags.length ? JSON.parse(searchTags) : undefined,
                isTopDeal,
                isExpress,
            });
        }

        resolve(new ApiResponseUtility({
            message: productId ? 'Product updated successfully!' : 'Product created successfully!',
            data: updatedProduct,
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while updating or creating product', error }));
    }
});

export default ProductUpdate;
