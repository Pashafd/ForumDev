import mongoose from "mongoose";
import config from "config";

const db: string = config.get("mongoURI");

export const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message, "when connect to db");
        // Exit process when failed
        process.exit(1);
    }
};
