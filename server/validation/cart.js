/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { CartJoiSchema } from '../joiSchema';

const cartValidationHandler = ({
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
    addProduct: (req, res, next) => cartValidationHandler({
        req, res, next, schema: CartJoiSchema.addProduct,
    }),
    updateProductQuantity: (req, res, next) => cartValidationHandler({
        req, res, next, schema: CartJoiSchema.updateProductQuantity,
    }),
    deleteProduct: (req, res, next) => cartValidationHandler({
        req, res, next, schema: CartJoiSchema.deleteProduct,
    }),
    cartDetail: (req, res, next) => cartValidationHandler({
        req, res, next, schema: CartJoiSchema.cartDetail,
    }),
};
