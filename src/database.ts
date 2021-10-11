import mongoose, { Mongoose } from "mongoose";

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(process.env.MONGODB_URI);

export const close = (): Promise<void> => mongoose.connection.close();
