/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const linkProductWithDealer = Joi.object().keys({
    productId: Joi.string().required(),
    dealerIds: Joi.array().required(),
    units: Joi.number().required(),
    availability: Joi.string().required(),
    status: Joi.string().required(),
}).unknown(true);

const unlinkProductWithDealer = Joi.object().keys({
    productId: Joi.string().required(),
    dealerId: Joi.string().required(),
}).unknown(true);

export default {
    linkProductWithDealer,
    unlinkProductWithDealer,
};
