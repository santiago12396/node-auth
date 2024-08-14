import mongoose from 'mongoose';

interface Options {
    mongoUrl: string;
    dbName: string;
}


export class MongoDatabase {

    static async connect(options: Options) {

        const { dbName, mongoUrl } = options;

        try {
            mongoose.connect(mongoUrl, {
                dbName
            });

            console.log('MongoDB connected');

        } catch (error) {
            console.log('MongoDB connection error');
            throw error;
        }

    }

}