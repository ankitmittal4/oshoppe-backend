import mongoose from 'mongoose';
import { MONGO_CONNECTION_STRING } from '../constants';

import('../constants');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_CONNECTION_STRING);
        console.log('Database connected');
    } catch (error) {
        console.log('Database not connected', error);
        process.exit(1);
    }
};

export default connectDB;
