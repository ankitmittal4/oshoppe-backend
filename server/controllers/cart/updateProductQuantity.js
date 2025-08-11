/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CartModel } from '../../models';

const UpdateProductQuantity = ({
    id,
    cartProductId,
    quantity,
}) => new Promise(async (resolve, reject) => {
    try {
        const product = await CartModel.findOneAndUpdate({
            _id: cartProductId,
            customerRef: id,
        }, {
            $set: {
                quantity,
            },
        });

        if (!product) {
            return reject(new ApiErrorUtility({ message: 'Product not found' }));
        }
        resolve(new ApiResponseUtility({ message: 'Product quantity updated successfully.', data: product }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while updating product quantity.', error }));
    }
});

export default UpdateProductQuantity;
