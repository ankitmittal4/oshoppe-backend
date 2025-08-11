/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { OrderJoiSchema } from '../joiSchema';

const orderValidationHandler = ({
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
    adminOrderList: (req, res, next) => orderValidationHandler({
        req, res, next, schema: OrderJoiSchema.adminOrderList,
    }),
    orderDetail: (req, res, next) => orderValidationHandler({
        req, res, next, schema: OrderJoiSchema.orderDetail,
    }),
    orderUpdate: (req, res, next) => orderValidationHandler({
        req, res, next, schema: OrderJoiSchema.orderUpdate,
    }),
    orderDelete: (req, res, next) => orderValidationHandler({
        req, res, next, schema: OrderJoiSchema.orderDelete,
    }),
    activityList: (req, res, next) => orderValidationHandler({
        req, res, next, schema: OrderJoiSchema.activityList,
    }),
};
