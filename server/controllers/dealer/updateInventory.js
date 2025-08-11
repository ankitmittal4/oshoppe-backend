/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductDealerModel } from '../../models';

const UpdateProductInventory = ({
    id,
    productId,
    units,
    availability,
    status,
}) => new Promise(async (resolve, reject) => {
    try {
        const updatedProductInventory = await ProductDealerModel.findOneAndUpdate({
            productRef: productId,
            dealerRef: id,
        }, {
            $set: {
                units,
                availability,
                status,
            },
        }, { new: true });

        if (!updatedProductInventory) {
            return reject(new ApiErrorUtility({ statusCode: 501, message: 'Product not found' }));
        }

        resolve(new ApiResponseUtility({ message: 'Product inventory updated successfully!', data: updatedProductInventory }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while updating product inventory', error }));
    }
});

export default UpdateProductInventory;
