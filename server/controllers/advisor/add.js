/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable no-async-promise-executor */
import { ApiResponseUtility, ApiErrorUtility } from '../../utility';
import { AdvisorModel } from '../../models';

export default ({
    id,
    pincode,
    qualification,
    jobDescription,
    serveEntirePincode,
    workMode,
    apartmentName,
    location,
}) => new Promise(async (resolve, reject) => {
    try {
        const advisor = await new AdvisorModel({
            customerRef: id,
            pincode,
            qualification,
            jobDescription,
            serveEntirePincode,
            workMode,
            apartmentName,
            location,
        }).save();

        if (!advisor) {
            reject(new ApiErrorUtility({ statusCode: 501, message: 'Something went wrong while becoming advisor' }));
        }

        resolve(new ApiResponseUtility({ message: 'Advisor details added successfully!', data: advisor }));
    } catch (error) {
        reject(new ApiErrorUtility({ message: 'Error while adding advisor details', error }));
    }
});
