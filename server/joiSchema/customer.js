/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string();
const firstName = Joi.string();
const lastName = Joi.string();
const profilePicture = Joi.object();
const occupation = Joi.string();
const gender = Joi.string();
const dob = Joi.date().allow('');
const countryCode = Joi.string();
const phoneNumber = Joi.string();
const alternatePhoneNumber = Joi.string().allow('');
const address = Joi.string();
const landmark = Joi.string().allow('');
const city = Joi.string();
const state = Joi.string();
const country = Joi.string().allow('');
const pincode = Joi.string();
const latitude = Joi.number();
const longitude = Joi.number();
const status = Joi.string().valid('A', 'D');

const signup = Joi.object().keys({
    email: email.required(),
    password: password.required(),
    firstName: firstName.required(),
    lastName,
    profilePicture,
    occupation,
    gender,
    dob,
    countryCode,
    phoneNumber,
    alternatePhoneNumber,
    pincode,
}).unknown(true);

const login = Joi.object().keys({
    email: email.required(),
    password: password.required(),
}).unknown(true);

const update = Joi.object().keys({
    firstName,
    lastName,
    alternatePhoneNumber,
    email,
    gender: Joi.string().valid('M', 'F', 'O'),
    dob,
}).unknown(true);

const productList = Joi.object().keys({
    text: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    minimumPrice: Joi.number(),
    maximumPrice: Joi.number(),
    brands: Joi.array(),
    discount: Joi.number(),
    applicationType: Joi.array(),
    finishType: Joi.array(),
    paintType: Joi.array(),
    highToLowPriceSort: Joi.number(),
    lowToHighPriceSort: Joi.number(),
    newestArrivalsSort: Joi.number(),
}).unknown(true);

const productDetail = Joi.object().keys({
    productId: Joi.string().required(),
}).unknown(true);

const addAddress = Joi.object().keys({
    address,
    landmark,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
}).unknown(true);

const customerList = Joi.object().keys({
    text: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
}).unknown(true);

const customerEdit = Joi.object().keys({
    customerId: Joi.string().required(),
    email,
    firstName,
    lastName,
    profilePicture,
    occupation,
    gender,
    dob,
    countryCode,
    phoneNumber,
    alternatePhoneNumber,
    address,
    landmark,
    city,
    state,
    country,
    pincode,
    status,
}).unknown(true);

const customerDelete = Joi.object().keys({
    customerId: Joi.string().required(),
}).unknown(true);

export default {
    signup,
    login,
    update,
    productList,
    productDetail,
    addAddress,
    customerList,
    customerEdit,
    customerDelete,
};
