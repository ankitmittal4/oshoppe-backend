/* eslint-disable no-promise-executor-return */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { DealerModel, ProductModel, ProductDealerModel } from '../../models';

const DealerUnlinkWithProduct = ({
    dealerId, productId,
}) => new Promise(async (resolve, reject) => {
    try {
        const dealerExists = await DealerModel.findOne({ _id: dealerId });
        if (!dealerExists) {
            return reject(new ApiErrorUtility({ message: 'Dealer not found' }));
        }

        const productExists = await ProductModel.findOne({ _id: productId });
        if (!productExists) {
            return reject(new ApiErrorUtility({ message: 'Product not found' }));
        }

        const deletedProductDealer = await ProductDealerModel.findOneAndDelete({ productRef: productId, dealerRef: dealerId });
        if (!deletedProductDealer) {
            return reject(new ApiErrorUtility({ message: 'Data not found.' }));
        }

        resolve(new ApiResponseUtility({
            message: 'Product unlinked with dealer successfully',
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while unlinking product from dealer', error }));
    }
});

export default DealerUnlinkWithProduct;
