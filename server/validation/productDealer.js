/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { ProductDealerJoiSchema } from '../joiSchema';

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
    linkProductWithDealer: (req, res, next) => customerValidationHandler({
        req, res, next, schema: ProductDealerJoiSchema.linkProductWithDealer,
    }),
    unlinkProductWithDealer: (req, res, next) => customerValidationHandler({
        req, res, next, schema: ProductDealerJoiSchema.unlinkProductWithDealer,
    }),
};
