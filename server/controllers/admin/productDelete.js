/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { ProductModel } from '../../models';

const DeleteServiceLocation = ({
    productId,
}) => new Promise(async (resolve, reject) => {
    try {
        const product = await ProductModel.findOneAndUpdate({
            _id: productId,
            deleted: false,
        }, {
            $set: {
                deleted: true,
            },
        });

        if (!product) {
            return reject(new ApiErrorUtility({ statusCode: 501, message: 'Product not found.' }));
        }

        resolve(new ApiResponseUtility({ message: 'Product deleted successfully.', data: product }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while deleting product.', error }));
    }
});

export default DeleteServiceLocation;
