/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { DealerModel } from '../../models';

const DealerLogin = ({
    email, password,
}) => new Promise(async (resolve, reject) => {
    try {
        const dealerExists = await DealerModel.findOne({ email: email.toLowerCase() });
        if (!dealerExists) {
            return reject(new ApiErrorUtility({ message: 'Account not found' }));
        }
        const passwordMatch = await dealerExists.isPasswordCorrect(password);
        if (!passwordMatch) {
            return reject(new ApiErrorUtility({ message: 'Incorrect password' }));
        }

        return resolve(new ApiResponseUtility({
            message: 'Dealer logged in successfully',
            data: {
                accessToken: await dealerExists.generateAccessToken(),
                admin: {
                    email: dealerExists.email,
                    createdAt: dealerExists.createdAt,
                },
            },
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while dealer login', error }));
    }
});

export default DealerLogin;
