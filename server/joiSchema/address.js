/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const addAddress = Joi.object().keys({
    address: Joi.string().required(),
    landmark: Joi.string().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string(),
    pincode: Joi.number().required(),
    addressType: Joi.string().required(),
    geoLocationCode: Joi.string(),
}).unknown(true);

const updateAddress = Joi.object().keys({
    addressId: Joi.string().required(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string(),
    landmark: Joi.string().allow(''),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    pincode: Joi.number(),
    addressType: Joi.string(),
    geoLocationCode: Joi.string(),
}).unknown(true);

const listAddress = Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
}).unknown(true);

const deleteAddress = Joi.object().keys({
    addressId: Joi.string().required(),
}).unknown(true);

export default {
    addAddress,
    updateAddress,
    listAddress,
    deleteAddress,
};
