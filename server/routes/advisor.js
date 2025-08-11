/* eslint-disable max-len */
/* eslint-disable import/named */
import AdvisorController from '../controllers/advisor';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware } from '../middlewares';

const prefix = '/api/advisor/';

export default (app) => {
    app.post(
        `${prefix}add`,
        AuthenticationMiddleware.authenticateCustomer,
        (req, res) => ResolverUtility(req, res, AdvisorController.AdvisorAddController),
    );
    app.post(
        `${prefix}detail`,
        AuthenticationMiddleware.authenticateCustomer,
        (req, res) => ResolverUtility(req, res, AdvisorController.AdvisorDetailController),
    );
    // app.post(
    //     `${prefix}list`,
    //     AuthenticationMiddleware.authenticateCustomer,
    //     AddressValidator.listAddress,
    //     (req, res) => ResolverUtility(req, res, AdvisorController.AdvisorAddController),
    // );
    // app.post(
    //     `${prefix}delete`,
    //     AuthenticationMiddleware.authenticateCustomer,
    //     AddressValidator.deleteAddress,
    //     (req, res) => ResolverUtility(req, res, AdvisorController.AdvisorAddController),
    // );
};
