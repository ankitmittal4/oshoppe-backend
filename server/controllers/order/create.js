/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AddressModel, OrderModel, SubOrderModel } from '../../models';
import { CartDetailController } from '../cart';
import { IdGeneratorService } from '../../services';
import { ORDER_STATUS, ORDER_TYPE, BASE_URL } from '../../constants';

export default ({
    id,
}) => new Promise(async (resolve, reject) => {
    try {
        const defaultAddress = await AddressModel.findOne({
            customerRef: id,
            isDefault: true,
        });
        if (!defaultAddress) {
            resolve(new ApiResponseUtility({ message: 'Please select an address.' }));
        }
        const { data: { products } } = await CartDetailController({ id });

        let totalAmount = 0;
        products.forEach((product) => {
            totalAmount += product.sellingPrice * product.quantity;
        });

        const deliveryCharges = 0;
        totalAmount += deliveryCharges;

        const order = await OrderModel.create({
            customerRef: id,
            type: ORDER_TYPE.NORMAL,
            price: totalAmount,
            deliveryCharges,
            addressRef: defaultAddress._id,
        });

        const shippingDate = new Date();
        shippingDate.setDate(shippingDate.getDate() + 3);
        shippingDate.setHours(23, 59, 59, 999);

        products.forEach(async (product) => {
            const subOrderId = await IdGeneratorService({ type: 'A' });
            await SubOrderModel.create({
                id: subOrderId,
                orderRef: order._id,
                productRef: product.productId,
                dealerRef: product.dealerId,
                quantity: product.quantity,
                price: product.sellingPrice,
                status: ORDER_STATUS.PENDING,
                shippingDate,
                tax: 0,
            });
        });

        const paymentUrl = `${BASE_URL}payment/webPage?id=${id}&orderId=${order._id}`;

        resolve(new ApiResponseUtility({ message: 'Order placed successfully.', data: paymentUrl }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while placing order.', error }));
    }
});
