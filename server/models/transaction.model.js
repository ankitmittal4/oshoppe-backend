import mongoose, { Schema } from 'mongoose';
import { TRANSACTION_STATUS } from '../constants';

const transactionSchema = new Schema(
    {
        customerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        orderRef: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        description: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        fees: {
            type: Number,
        },
        tax: {
            type: Number,
        },
        razorpayResponse: {
            type: Object,
        },
        status: {
            type: Number,
            default: TRANSACTION_STATUS.PENDING,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Transaction', transactionSchema);
