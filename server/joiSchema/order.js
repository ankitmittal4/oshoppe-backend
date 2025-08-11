/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const adminOrderList = Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
}).unknown(true);

const orderDetail = Joi.object().keys({
    subOrderId: Joi.string().required(),
}).unknown(true);

const orderUpdate = Joi.object().keys({
    subOrderId: Joi.string().required(),
    dealerRef: Joi.string(),
    shippingDate: Joi.string(),
    status: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12),
}).unknown(true);

const orderDelete = Joi.object().keys({
    subOrderId: Joi.string().required(),
}).unknown(true);

const activityList = Joi.object().keys({
    subOrderId: Joi.string().required(),
    page: Joi.number(),
    limit: Joi.number(),
}).unknown(true);

export default {
    adminOrderList,
    orderDetail,
    orderUpdate,
    orderDelete,
    activityList,
};
