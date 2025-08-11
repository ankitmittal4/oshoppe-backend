/* eslint-disable max-len */
/* eslint-disable import/named */
import WishlistController from '../controllers/wishlist';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware } from '../middlewares';
import {
    WishlistValidator,
} from '../validation';

const prefix = '/api/wishlist/';

export default (app) => {
    app.post(
        `${prefix}modify`,
        AuthenticationMiddleware.authenticateCustomer,
        WishlistValidator.modifyWishlist,
        (req, res) => ResolverUtility(req, res, WishlistController.WishlistModifyController),
    );
    app.post(
        `${prefix}list`,
        AuthenticationMiddleware.authenticateCustomer,
        (req, res) => ResolverUtility(req, res, WishlistController.WishlistListController),
    );
};
