/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { AdminJoiSchema } from '../joiSchema';

const adminValidationHandler = ({
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
    signup: (req, res, next) => adminValidationHandler({
        req, res, next, schema: AdminJoiSchema.signup,
    }),
    login: (req, res, next) => adminValidationHandler({
        req, res, next, schema: AdminJoiSchema.login,
    }),
};
