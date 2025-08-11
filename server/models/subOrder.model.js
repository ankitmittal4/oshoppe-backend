import mongoose, { Schema } from 'mongoose';

const subOrderSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        orderRef: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        productRef: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        dealerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Dealer',
            required: true,
        },
        colorRef: {
            type: Schema.Types.ObjectId,
            ref: 'Color',
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            required: true,
        },
        shippingDate: {
            type: Date,
            required: true,
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

export default mongoose.model('SubOrder', subOrderSchema);
