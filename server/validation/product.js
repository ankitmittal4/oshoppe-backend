/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { ProductJoiSchema } from '../joiSchema';

const productValidationHandler = ({
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
    productAdd: (req, res, next) => productValidationHandler({
        req, res, next, schema: ProductJoiSchema.productAdd,
    }),
    // productList: (req, res, next) => productValidationHandler({
    //     req, res, next, schema: ProductJoiSchema.productList,
    // }),
    productDetail: (req, res, next) => productValidationHandler({
        req, res, next, schema: ProductJoiSchema.productDetail,
    }),
    productDelete: (req, res, next) => productValidationHandler({
        req, res, next, schema: ProductJoiSchema.productDelete,
    }),
};
