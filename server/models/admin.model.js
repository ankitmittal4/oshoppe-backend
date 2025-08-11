/* eslint-disable no-underscore-dangle */
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } from '../constants';

const adminSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: ['M', 'F', 'O'],
            default: 'M',
        },
        dob: {
            type: Date,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        countryCode: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        alternatePhoneNumber: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        geoLocationCode: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['A', 'D'],
            default: 'A',
        },
        lastLoginTime: {
            type: Date,
            required: true,
            default: new Date(),
        },
        idProofType: {
            type: String,
            required: true,
        },
        idProofNumber: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: 'admin',
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        },
    );
};

export default mongoose.model('admin', adminSchema);
