/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';

const brandSchema = new Schema(
    {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        categoryRef: {
            type: Schema.Types.ObjectId,
        },
        subCategoryRefs: [
            {
                type: Schema.Types.ObjectId,
            },
        ],
        colorRefs: [
            {
                type: Schema.Types.ObjectId,
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('brand', brandSchema);
