/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CartModel } from '../../models';

const DeleteProduct = ({
    id,
    cartProductId,
}) => new Promise(async (resolve, reject) => {
    try {
        const deletedProduct = await CartModel.findByIdAndDelete({
            _id: cartProductId,
            customerRef: id,
        });

        if (!deletedProduct) {
            return reject(new ApiErrorUtility({ message: 'Product not found' }));
        }
        resolve(new ApiResponseUtility({ message: 'Product deleted successfully.' }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting product.', error }));
    }
});

export default DeleteProduct;
