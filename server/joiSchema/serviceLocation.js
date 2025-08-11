/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const addServiceLocation = Joi.object().keys({
    dealerId: Joi.string().required(),
    pincode: Joi.number().required(),
    locationName: Joi.string(),
    state: Joi.string(),
}).unknown(true);

const editServiceLocation = Joi.object().keys({
    serviceLocationId: Joi.string().required(),
    pincode: Joi.number(),
    locationName: Joi.string(),
    state: Joi.string(),
}).unknown(true);

const deleteServiceLocation = Joi.object().keys({
    serviceLocationId: Joi.string().required(),
}).unknown(true);

const listServiceLocation = Joi.object().keys({
    dealerId: Joi.string().required(),
}).unknown(true);

export default {
    addServiceLocation,
    editServiceLocation,
    deleteServiceLocation,
    listServiceLocation,
};
