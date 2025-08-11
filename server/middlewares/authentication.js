/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { ApiErrorUtility } from '../utility';
import { AdminModel, DealerModel, CustomerModel } from '../models';
import { ACCESS_TOKEN_SECRET } from '../constants';

const prepareDecodedData = ({ token, type }) => new Promise(async (resolve, reject) => {
    try {
        const decodedData = jwt.verify(token, ACCESS_TOKEN_SECRET);
        let userData;
        if (decodedData) {
            const { id, role } = decodedData;
            if (role === type) {
                if (role === 'customer') {
                    userData = await CustomerModel.findOne({ _id: id });
                } else if (role === 'dealer') {
                    userData = await DealerModel.findOne({ _id: id });
                } else {
                    userData = await AdminModel.findOne({ _id: id });
                }
                if (!userData) {
                    reject();
                }

                resolve({
                    id, type,
                });
            }
        }
        reject();
    } catch (err) {
        reject();
    }
});
const commonDecodingHandler = ({
    req,
    res,
    next,
    type,
}) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.replace('Bearer ', '');
    if (token) {
        prepareDecodedData({ token, type, res })
            .then((payload) => {
                if (payload) {
                    const body = { ...req.body, ...payload };
                    req.body = body;
                    return next();
                }
            })
            .catch(() => res.status(401).json(new ApiErrorUtility({ code: 401, message: 'Token might be invalid or has been expired', error: 'Token Invalid.' })));
    } else {
        res.status(400).json(new ApiErrorUtility({ code: 400, message: 'Malformed Request', error: 'Missing Headers' }));
    }
};

export default {
    authenticateCustomer: (req, res, next) => commonDecodingHandler({
        req, res, next, type: 'customer',
    }),
    authenticateDealer: (req, res, next) => commonDecodingHandler({
        req, res, next, type: 'dealer',
    }),
    authenticateAdmin: (req, res, next) => commonDecodingHandler({
        req, res, next, type: 'admin',
    }),
};
