/* eslint-disable max-len */
/* eslint-disable import/named */
import {
    AddressAddController, AddressUpdateController, AddressListController, AddressDeleteController,
} from '../controllers/address';
import { ResolverUtility } from '../utility';
import { AuthenticationMiddleware } from '../middlewares';
import { AddressValidator } from '../validation';

const prefix = '/api/address/';

export default (app) => {
    app.post(
        `${prefix}add`,
        AuthenticationMiddleware.authenticateCustomer,
        AddressValidator.addAddress,
        (req, res) => ResolverUtility(req, res, AddressAddController),
    );
    app.post(
        `${prefix}update`,
        AuthenticationMiddleware.authenticateCustomer,
        AddressValidator.updateAddress,
        (req, res) => ResolverUtility(req, res, AddressUpdateController),
    );
    app.post(
        `${prefix}list`,
        AuthenticationMiddleware.authenticateCustomer,
        AddressValidator.listAddress,
        (req, res) => ResolverUtility(req, res, AddressListController),
    );
    app.post(
        `${prefix}delete`,
        AuthenticationMiddleware.authenticateCustomer,
        AddressValidator.deleteAddress,
        (req, res) => ResolverUtility(req, res, AddressDeleteController),
    );
};
