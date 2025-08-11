/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const addProduct = Joi.object().keys({
    productId: Joi.string().required(),
    dealerId: Joi.string().required(),
    quantity: Joi.number().required(),
}).unknown(true);

const updateProductQuantity = Joi.object().keys({
    cartProductId: Joi.string().required(),
    quantity: Joi.number().required(),
}).unknown(true);

const deleteProduct = Joi.object().keys({
    cartProductId: Joi.string().required(),
}).unknown(true);

export default {
    addProduct,
    updateProductQuantity,
    deleteProduct,
};
