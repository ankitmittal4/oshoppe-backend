import mongoose, { Schema } from 'mongoose';

const colorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        groupName: {
            type: String,
        },
        ncsCode: {
            type: String,
            required: true,
            trim: true,
        },
        hexCode: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('color', colorSchema);
