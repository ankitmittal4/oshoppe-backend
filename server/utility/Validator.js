/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-promise-executor-return */
import { ApiErrorUtility } from '.';

export default (body, schema) => new Promise(async (resolve, reject) => {
    try {
        await schema.validateAsync(body, { abortEarly: false });
        resolve();
    } catch (err) {
        return reject(new ApiErrorUtility({
            message: err.details[0].message,
        }));
    }
    return resolve();
});
