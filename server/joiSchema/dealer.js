/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string();
const firstName = Joi.string();
const lastName = Joi.string();
const shopImage = Joi.object();
const occupation = Joi.string();
const gender = Joi.string();
const dob = Joi.date();
const countryCode = Joi.string();
const phoneNumber = Joi.string();
const alternatePhoneNumber = Joi.string();
const addressLine1 = Joi.string();
const addressLine2 = Joi.string();
const landmark = Joi.string();
const city = Joi.string();
const state = Joi.string();
const country = Joi.string();
const pincode = Joi.number();
const latitude = Joi.number();
const longitude = Joi.number();
const status = Joi.string();

const dealerAdd = Joi.object().keys({
    dealerId: Joi.string(),
    email,
    firstName,
    lastName,
    shopImage,
    occupation,
    gender,
    dob,
    countryCode,
    phoneNumber,
    alternatePhoneNumber,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
    status,
}).unknown(true);

const login = Joi.object().keys({
    email: email.required(),
    password: password.required(),
}).unknown(true);

const productList = Joi.object().keys({
    text: Joi.string(),
}).unknown(true);

const updateInventory = Joi.object().keys({
    productId: Joi.string().required(),
    units: Joi.number().required(),
    availability: Joi.string().valid('Y', 'N').required(),
    status: Joi.string().valid('A', 'D').required(),
}).unknown(true);

const dealerList = Joi.object().keys({
    text: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
}).unknown(true);

const dealerDelete = Joi.object().keys({
    dealerId: Joi.string().required(),
}).unknown(true);

export default {
    dealerAdd,
    dealerList,
    dealerDelete,
    login,
    productList,
    updateInventory,
};
