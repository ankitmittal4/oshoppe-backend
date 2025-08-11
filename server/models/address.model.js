/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';

const addressSchema = new Schema(
    {
        customerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        address: {
            type: String,
        },
        addressType: {
            type: String,
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        pincode: {
            type: Number,
        },
        location: {
            type: { type: String, default: 'Point' },
            coordinates: [Number, Number],
        },
        geoLocationCode: {
            type: String,
        },
        isDefault: {
            type: Boolean,
            default: false,
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

addressSchema.index({ location: '2dsphere' });

export default mongoose.model('address', addressSchema);
