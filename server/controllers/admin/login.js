/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable import/named */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AdminModel } from '../../models';

const AdminLogin = ({
    email, password,
}) => new Promise(async (resolve, reject) => {
    try {
        const adminExists = await AdminModel.findOne({ email: email.toLowerCase() });
        if (!adminExists) {
            return reject(new ApiErrorUtility({ message: 'Account not found' }));
        }
        const passwordMatch = await adminExists.isPasswordCorrect(password);
        if (!passwordMatch) {
            return reject(new ApiErrorUtility({ message: 'Incorrect password' }));
        }

        return resolve(new ApiResponseUtility({
            message: 'Admin logged in successfully',
            data: {
                accessToken: await adminExists.generateAccessToken(),
                admin: {
                    email: adminExists.email,
                    createdAt: adminExists.createdAt,
                },
            },
        }));
    } catch (error) {
        console.log(error);
        reject(new ApiErrorUtility({ message: 'Error while admin login', error }));
    }
});

export default AdminLogin;
