/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { CartModel, ProductDealerModel } from '../../models';

const AddProduct = ({
    id,
    productId,
    dealerId,
    quantity = 1,
}) => new Promise(async (resolve, reject) => {
    try {
        const productDealer = await ProductDealerModel.findOne({
            productRef: productId,
            dealerRef: dealerId,
        });

        if (!productDealer) {
            return reject(new ApiErrorUtility({ message: 'Invalid productId or dealerId' }));
        }

        const productAlreadyAdded = await CartModel.findOne({
            customerRef: id,
            productRef: productId,
            dealerRef: dealerId,
        });

        let addedProduct;
        if (productAlreadyAdded) {
            addedProduct = await CartModel.findOneAndUpdate({
                customerRef: id,
                productRef: productId,
                dealerRef: dealerId,
            }, {
                $inc: {
                    quantity: 1,
                },
            }, { new: true });
        } else {
            addedProduct = await new CartModel({
                customerRef: id,
                productRef: productId,
                dealerRef: dealerId,
                quantity,
            }).save();
        }
        resolve(new ApiResponseUtility({ message: 'Product added to cart successfully.', data: addedProduct }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while adding product to cart.', error }));
    }
});

export default AddProduct;
