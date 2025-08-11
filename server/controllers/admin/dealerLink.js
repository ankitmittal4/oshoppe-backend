/* eslint-disable no-promise-executor-return */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { DealerModel, ProductModel, ProductDealerModel } from '../../models';

const DealerLinkWithProduct = ({
    dealerIds, productId, units, availability, status,
}) => new Promise(async (resolve, reject) => {
    try {
        const dealerExists = await DealerModel.find({ _id: { $in: dealerIds } });
        if (dealerExists.length !== dealerIds.length) {
            return reject(new ApiErrorUtility({ message: 'One or more dealers not found' }));
        }

        const productExists = await ProductModel.findOne({ _id: productId });
        if (!productExists) {
            return reject(new ApiErrorUtility({ message: 'Product not found' }));
        }

        // Filter out dealers that already have the product linked
        const dealersToProcess = await Promise.all(dealerIds.map(async (dealerId) => {
            const productDealerExists = await ProductDealerModel.findOne({ productRef: productId, dealerRef: dealerId });
            return productDealerExists ? null : dealerId;
        }));

        // Remove nulls from the array (dealers already linked)
        const filteredDealerIds = dealersToProcess.filter((dealerId) => dealerId !== null);

        await Promise.all(filteredDealerIds.map(async (dealerId) => {
            await new ProductDealerModel({
                productRef: productId,
                dealerRef: dealerId,
                units,
                availability,
                status,
            }).save();
        }));

        resolve(new ApiResponseUtility({
            message: 'Product linked with dealer successfully',
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while linking product with dealer', error }));
    }
});

export default DealerLinkWithProduct;
