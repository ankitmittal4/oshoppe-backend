/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { ServiceLocationJoiSchema } from '../joiSchema';

const serviceLocationValidationHandler = ({
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
    addServiceLocation: (req, res, next) => serviceLocationValidationHandler({
        req, res, next, schema: ServiceLocationJoiSchema.addServiceLocation,
    }),
    editServiceLocation: (req, res, next) => serviceLocationValidationHandler({
        req, res, next, schema: ServiceLocationJoiSchema.editServiceLocation,
    }),
    deleteServiceLocation: (req, res, next) => serviceLocationValidationHandler({
        req, res, next, schema: ServiceLocationJoiSchema.deleteServiceLocation,
    }),
    listServiceLocation: (req, res, next) => serviceLocationValidationHandler({
        req, res, next, schema: ServiceLocationJoiSchema.listServiceLocation,
    }),
};
