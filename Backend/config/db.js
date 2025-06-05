import mongoose from "mongoose";

 const connectDb = async()=>{
    try{ 

         mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGODB CONNECTED`)
    }catch(err){
         console.log("db error")
    }
}

export default connectDb