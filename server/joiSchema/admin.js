/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const email = Joi.string().email();
const password = Joi.string();
const secretKey = Joi.string();
const firstName = Joi.string();
const lastName = Joi.string();
const image = Joi.object();
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
const geoLocationCode = Joi.string();
const status = Joi.string();
const idProofType = Joi.string();
const idProofNumber = Joi.string();

const signup = Joi.object().keys({
    email: email.required(),
    password: password.required(),
    secretKey: secretKey.required(),
    firstName: firstName.required(),
    lastName: lastName.required(),
    image: image.required(),
    gender: gender.required(),
    dob: dob.required(),
    countryCode: countryCode.required(),
    phoneNumber: phoneNumber.required(),
    alternatePhoneNumber: alternatePhoneNumber.required(),
    addressLine1: addressLine1.required(),
    addressLine2: addressLine2.required(),
    landmark: landmark.required(),
    city: city.required(),
    state: state.required(),
    country: country.required(),
    pincode: pincode.required(),
    geoLocationCode: geoLocationCode.required(),
    status: status.required(),
    idProofType: idProofType.required(),
    idProofNumber: idProofNumber.required(),
}).unknown(true);

const login = Joi.object().keys({
    email: email.required(),
    password: password.required(),
}).unknown(true);

export default {
    signup,
    login,
};
