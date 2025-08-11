/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';

const subCategorySchema = new Schema(
    {
        name: {
            type: String,
        },
        categoryName: {
            type: String,
        },
        image: {
            type: String,
        },
        categoryRef: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
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

export default mongoose.model('subCategory', subCategorySchema);
