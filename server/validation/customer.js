/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { CustomerJoiSchema } from '../joiSchema';

const customerValidationHandler = ({
    req,
    res,
    next,
    schema,
}) => {
    ValidatorUtility(req.body, schema).then(() => {
        next();
    }).catch((err) => {
        res.status(400).json(new ApiErrorUtility({ code: 400, message: err.message }));
    });
};

export default {
    signup: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.signup,
    }),
    login: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.login,
    }),
    update: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.update,
    }),
    customerList: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.customerList,
    }),
    customerEdit: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.customerEdit,
    }),
    customerDelete: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.customerDelete,
    }),
    productList: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.productList,
    }),
    productDetail: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.productDetail,
    }),
    addAddress: (req, res, next) => customerValidationHandler({
        req, res, next, schema: CustomerJoiSchema.addAddress,
    }),
};
