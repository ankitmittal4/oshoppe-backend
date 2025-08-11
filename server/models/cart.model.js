import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
    {
        customerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
        productRef: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        dealerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Dealer',
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('cart', cartSchema);
