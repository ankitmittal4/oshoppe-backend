/* eslint-disable max-len */
/* eslint-disable import/named */
import {
    CustomerProductListController, CustomerProductDetailController,
} from '../controllers/customer';
import { ResolverUtility } from '../utility';
import { CustomerValidator } from '../validation';

const prefix = '/api/guest/';

export default (app) => {
    app.post(
        `${prefix}productList`,
        CustomerValidator.productList,
        (req, res) => ResolverUtility(req, res, CustomerProductListController),
    );
    app.post(
        `${prefix}productDetail`,
        CustomerValidator.productDetail,
        (req, res) => ResolverUtility(req, res, CustomerProductDetailController),
    );
};
