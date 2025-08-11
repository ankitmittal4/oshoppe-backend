/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
        },
        image: {
            type: String,
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

export default mongoose.model('category', categorySchema);
