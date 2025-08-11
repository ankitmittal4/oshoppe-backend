/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';
import { ADVISOR_WORK_MODE } from '../constants';

const advisorSchema = new Schema(
    {
        customerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        pincode: {
            type: Number,
        },
        qualification: {
            type: String,
        },
        jobDescription: {
            type: String,
        },
        serveEntirePincode: {
            type: Boolean,
            default: false,
        },
        workMode: {
            type: Boolean,
        },
        apartmentName: {
            type: String,
        },
        location: {
            type: String,
        },
        verifiedByAdmin: {
            type: Boolean,
            default: false,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('advisor', advisorSchema);
