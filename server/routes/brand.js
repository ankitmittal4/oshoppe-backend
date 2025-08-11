/* eslint-disable max-len */
/* eslint-disable import/named */
import BrandController from '../controllers/brand';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware, MultipartMiddleware } from '../middlewares';

const prefix = '/api/brand/';

export default (app) => {
    app.post(
        `${prefix}add`,
        MultipartMiddleware,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, BrandController.BrandAddController),
    );
    app.post(
        `${prefix}list`,
        (req, res) => ResolverUtility(req, res, BrandController.BrandListController),
    );
    app.post(
        `${prefix}detail`,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, BrandController.BrandDetailController),
    );
    app.post(
        `${prefix}delete`,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, BrandController.BrandDeleteController),
    );
};
