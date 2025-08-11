/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';

const productAdd = Joi.object().keys({
    productId: Joi.string(),
    productType: Joi.string(),
    shortDescription: Joi.string(),
    longDescription: Joi.string(),
    quantity: Joi.number(),
    group: Joi.string(),
    subGroup: Joi.string(),
    brand: Joi.string(),
    weight: Joi.number(),
    length: Joi.number(),
    width: Joi.number(),
    height: Joi.number(),
    manufacturingDate: Joi.date(),
    expiryDate: Joi.date(),
    specialFeature: Joi.string(),
    mrp: Joi.number(),
    sellingPrice: Joi.number(),
    tax: Joi.number(),
    image1: Joi.object(),
    image2: Joi.object(),
    image3: Joi.object(),
    image4: Joi.object(),
    image5: Joi.object(),
    warranty: Joi.string(),
    colour: Joi.string(),
    status: Joi.string().valid('A', 'D'),
    finishType: Joi.string().allow(''),
    about: Joi.string(),
}).unknown(true);

const productDetail = Joi.object().keys({
    productId: Joi.string().required(),
}).unknown(true);

const productDelete = Joi.object().keys({
    productId: Joi.string().required(),
}).unknown(true);

export default {
    productAdd,
    // productUpdate,
    productDetail,
    productDelete,
};

// name
// type
// shortDescription
// longDescription
// quantity
// group
// subGroup
// brand
// weight
// length
// width
// height
// manufacturingDate
// expiryDate
// specialFeature
// mrp
// sellingPrice
// images
// warranty
// colour
// finishType
// about
