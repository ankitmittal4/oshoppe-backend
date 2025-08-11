/* eslint-disable max-len */
/* eslint-disable import/named */
import {
    CartAddProductController, CartUpdateProductQuantityController, CartDeleteProductController, CartDetailController,
} from '../controllers/cart';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware } from '../middlewares';
import { CartValidator } from '../validation';

const prefix = '/api/cart/';

export default (app) => {
    app.post(
        `${prefix}addProduct`,
        AuthenticationMiddleware.authenticateCustomer,
        CartValidator.addProduct,
        (req, res) => ResolverUtility(req, res, CartAddProductController),
    );
    app.post(
        `${prefix}updateProductQuantity`,
        AuthenticationMiddleware.authenticateCustomer,
        CartValidator.updateProductQuantity,
        (req, res) => ResolverUtility(req, res, CartUpdateProductQuantityController),
    );
    app.post(
        `${prefix}deleteProduct`,
        AuthenticationMiddleware.authenticateCustomer,
        CartValidator.deleteProduct,
        (req, res) => ResolverUtility(req, res, CartDeleteProductController),
    );
    app.post(
        `${prefix}detail`,
        AuthenticationMiddleware.authenticateCustomer,
        (req, res) => ResolverUtility(req, res, CartDetailController),
    );
};
