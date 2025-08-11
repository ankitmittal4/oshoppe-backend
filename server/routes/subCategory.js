/* eslint-disable max-len */
/* eslint-disable import/named */
import SubCategoryController from '../controllers/subCategory';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware, MultipartMiddleware } from '../middlewares';

const prefix = '/api/subCategory/';

export default (app) => {
    app.post(
        `${prefix}add`,
        MultipartMiddleware,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, SubCategoryController.SubCategoryAddController),
    );
    app.post(
        `${prefix}list`,
        (req, res) => ResolverUtility(req, res, SubCategoryController.SubCategoryListController),
    );
    app.post(
        `${prefix}delete`,
        AuthenticationMiddleware.authenticateAdmin,
        (req, res) => ResolverUtility(req, res, SubCategoryController.SubCategoryDeleteController),
    );
};
