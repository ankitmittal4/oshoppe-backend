/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
import { CustomerModel, DealerModel, ProductModel, SubOrderModel } from '../models';

export default async ({ type }) => {
    try {
        const today = new Date();
        const offsetIST = 5 * 60 + 30;
        const todayIST = new Date(today.getTime() + offsetIST * 60 * 1000);

        const year = String(todayIST.getFullYear()).slice(-2);
        const month = String(todayIST.getMonth() + 1).padStart(2, '0');
        const day = String(todayIST.getUTCDate()).padStart(2, '0');

        const dateString = `${year}${month}${day}`;

        let modelType;
        switch (type) {
        case 'C': {
            modelType = CustomerModel;
            break;
        }
        case 'D': {
            modelType = DealerModel;
            break;
        }
        case 'P': {
            modelType = ProductModel;
            break;
        }
        case 'A': {
            modelType = SubOrderModel;
            break;
        }
        default:
            throw new Error('Invalid model type');
        }

        const latestEntry = await modelType.findOne({ id: { $regex: `^${dateString}${type}` } })
            .sort({ id: -1 });

        let nextIdNumber;

        if (latestEntry) {
            const lastIdNumber = parseInt(latestEntry.id.slice(-4), 10);
            nextIdNumber = lastIdNumber + 1;
        } else {
            nextIdNumber = 1;
        }

        const nextIdString = String(nextIdNumber).padStart(4, '0');

        return `${dateString}${type}${nextIdString}`;
    } catch (err) {
        return new Error('Error while generating id');
    }
};
