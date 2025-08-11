/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';

const wishlistSchema = new Schema(
    {
        customerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        wishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('wishlist', wishlistSchema);
