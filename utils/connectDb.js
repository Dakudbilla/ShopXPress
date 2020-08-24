import mongoose from "mongoose";

const connection = {};

const connectDb = async () => {
  //use new databse connection
  try {
    if (connection.isConnected) {
      //Use existing databse connection
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO_SRV, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Connected");

    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error(err.message, "Connection failed");
  }
};

export default connectDb;
