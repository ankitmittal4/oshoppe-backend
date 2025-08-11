/* eslint-disable import/no-extraneous-dependencies */
import Joi from 'joi';
import { WISHLIST_ACTION } from '../constants';

const modifyWishlist = Joi.object().keys({
    productRef: Joi.string().required(),
    action: Joi.number().required().valid(WISHLIST_ACTION.ADD, WISHLIST_ACTION.REMOVE),
}).unknown(true);

export default {
    modifyWishlist,
};
