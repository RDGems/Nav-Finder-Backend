import mongoose, { ConnectOptions } from "mongoose";
require('dotenv').config();

export const dbConnect = async () => {
    mongoose.set('strictQuery', true);
    // strictQuery is used to check if the query is valid or not 
    mongoose.set('debug', false);

    if (!process.env.DATABASE_URL) {
        console.error('Database URL not found');
        return;
    }
    try {
        // const options: any = {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // };
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected successfully');
    }
    catch {
        console.error('Database connection failed');
        process.exit(1);
        // 1 means process exit with error
        // 0 means process exit without error
    }
}