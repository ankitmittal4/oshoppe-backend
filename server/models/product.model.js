import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        adminRef: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
        name: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        longDescription: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
        },
        brandImage: {
            type: String,
        },
        weight: {
            type: Number,
        },
        length: {
            type: Number,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        manufacturingDate: {
            type: Date,
        },
        expiryDate: {
            type: Date,
        },
        specialFeature: {
            type: String,
        },
        mrp: {
            type: Number,
            required: true,
        },
        sellingPrice: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        image1: {
            type: String,
        },
        image2: {
            type: String,
        },
        image3: {
            type: String,
        },
        image4: {
            type: String,
        },
        image5: {
            type: String,
        },
        warranty: {
            type: String,
        },
        service: {
            type: String,
        },
        replacementWarranty: {
            type: Boolean,
            default: false,
        },
        colour: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Colour',
            },
        ],
        finishType: {
            type: String,
        },
        status: {
            type: String,
            enum: ['A', 'D'],
            default: 'A',
        },
        about: [
            {
                type: String,
            },
        ],
        isTopDeal: {
            type: Boolean,
            default: false,
        },
        isExpress: {
            type: Boolean,
            default: false,
        },
        searchTags: [
            {
                type: String,
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

export default mongoose.model('product', productSchema);
