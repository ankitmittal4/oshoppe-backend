/* eslint-disable import/named */
import { ValidatorUtility, ApiErrorUtility } from '../utility';
import { WishlistJoiSchema } from '../joiSchema';

const wishlistValidationHandler = ({
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
    modifyWishlist: (req, res, next) => wishlistValidationHandler({
        req, res, next, schema: WishlistJoiSchema.modifyWishlist,
    }),
};
