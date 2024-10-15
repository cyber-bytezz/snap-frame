import mongoose from "mongoose";

export const connectToDatabase = async () => {
   try{
    await mongoose.connect(process.env.DATABASE_URL!,{
        dbName: "snapframe",
    });
   }catch(error){
    console.log(error)
   }
}