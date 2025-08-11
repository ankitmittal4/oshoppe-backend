import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
    {
        customerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        type: {
            type: Number,
        },
        price: {
            type: Number,
            required: true,
        },
        deliveryCharges: {
            type: Number,
            required: true,
        },
        addressRef: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Order', orderSchema);
