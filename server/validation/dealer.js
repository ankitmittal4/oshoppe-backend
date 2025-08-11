/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { DealerJoiSchema } from '../joiSchema';

const dealerValidationHandler = ({
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
    dealerAdd: (req, res, next) => dealerValidationHandler({
        req, res, next, schema: DealerJoiSchema.dealerAdd,
    }),
    dealerList: (req, res, next) => dealerValidationHandler({
        req, res, next, schema: DealerJoiSchema.dealerList,
    }),
    dealerDelete: (req, res, next) => dealerValidationHandler({
        req, res, next, schema: DealerJoiSchema.dealerDelete,
    }),
    dealerLogin: (req, res, next) => dealerValidationHandler({
        req, res, next, schema: DealerJoiSchema.login,
    }),
    productList: (req, res, next) => dealerValidationHandler({
        req, res, next, schema: DealerJoiSchema.productList,
    }),
    updateInventory: (req, res, next) => dealerValidationHandler({
        req, res, next, schema: DealerJoiSchema.updateInventory,
    }),
};
