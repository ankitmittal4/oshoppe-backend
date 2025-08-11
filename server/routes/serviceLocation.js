/* eslint-disable max-len */
/* eslint-disable import/named */
import {
    ServiceLocationAddController, ServiceLocationListController, ServiceLocationDeleteController, ServiceLocationEditController,
} from '../controllers/serviceLocation';
import { ResolverUtility } from '../utility';
import { ServiceLocationValidator } from '../validation';
import { AuthenticationMiddleware } from '../middlewares';

const prefix = '/api/serviceLocation/';

export default (app) => {
    app.post(
        `${prefix}add`,
        AuthenticationMiddleware.authenticateAdmin,
        ServiceLocationValidator.addServiceLocation,
        (req, res) => ResolverUtility(req, res, ServiceLocationAddController),
    );
    app.patch(
        `${prefix}edit`,
        AuthenticationMiddleware.authenticateAdmin,
        ServiceLocationValidator.editServiceLocation,
        (req, res) => ResolverUtility(req, res, ServiceLocationEditController),
    );
    app.post(
        `${prefix}list`,
        AuthenticationMiddleware.authenticateAdmin,
        ServiceLocationValidator.listServiceLocation,
        (req, res) => ResolverUtility(req, res, ServiceLocationListController),
    );
    app.post(
        `${prefix}delete`,
        AuthenticationMiddleware.authenticateAdmin,
        ServiceLocationValidator.deleteServiceLocation,
        (req, res) => ResolverUtility(req, res, ServiceLocationDeleteController),
    );
};
