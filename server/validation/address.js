/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { AddressJoiSchema } from '../joiSchema';

const addressValidationHandler = ({
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
    addAddress: (req, res, next) => addressValidationHandler({
        req, res, next, schema: AddressJoiSchema.addAddress,
    }),
    updateAddress: (req, res, next) => addressValidationHandler({
        req, res, next, schema: AddressJoiSchema.updateAddress,
    }),
    listAddress: (req, res, next) => addressValidationHandler({
        req, res, next, schema: AddressJoiSchema.listAddress,
    }),
    deleteAddress: (req, res, next) => addressValidationHandler({
        req, res, next, schema: AddressJoiSchema.deleteAddress,
    }),
};
