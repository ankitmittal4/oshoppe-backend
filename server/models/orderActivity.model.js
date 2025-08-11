import mongoose, { Schema } from 'mongoose';
import { USER_TYPE } from '../constants';

const orderActivitySchema = new Schema(
    {
        subOrderRef: {
            type: Schema.Types.ObjectId,
            ref: 'SubOrder',
            required: true,
        },
        userType: {
            type: Number,
            enum: [USER_TYPE.ADMIN, USER_TYPE.DEALER],
            default: USER_TYPE.ADMIN,
        },
        status: {
            type: Number,
            required: true,
        },
        notes: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('OrderActivity', orderActivitySchema);
