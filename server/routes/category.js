/* eslint-disable max-len */
/* eslint-disable import/named */
import CategoryController from '../controllers/category';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware, MultipartMiddleware } from '../middlewares';

const prefix = '/api/category/';

export default (app) => {
    app.post(
        `${prefix}add`,
        MultipartMiddleware,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, CategoryController.CategoryAddController),
    );
    app.post(
        `${prefix}list`,
        (req, res) => ResolverUtility(req, res, CategoryController.CategoryListController),
    );
    app.post(
        `${prefix}delete`,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, CategoryController.CategoryDeleteController),
    );
};
