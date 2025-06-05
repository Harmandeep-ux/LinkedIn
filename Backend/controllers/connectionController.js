import Connection from "../models/connectionModel.js"
import User from "../models/userModel.js"
import { io ,userSocketMap} from "../index.js"


export const sendConnection = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { id: receiverId } = req.params;
        const senderId = req.userId;

        // 1. Validate IDs
        if (!mongoose.Types.ObjectId.isValid(receiverId) || 
            !mongoose.Types.ObjectId.isValid(senderId)) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Invalid user ID format" });
        }

        // 2. Check if sending to self
        if (senderId === receiverId) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Cannot connect with yourself" });
        }

        // 3. Check if users exist
        const [sender, receiver] = await Promise.all([
            User.findById(senderId).session(session),
            User.findById(receiverId).session(session)
        ]);

        if (!sender || !receiver) {
            await session.abortTransaction();
            return res.status(404).json({ msg: "User not found" });
        }

        // 4. Check if already connected
        if (sender.connection.includes(receiverId)) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Already connected" });
        }

        // 5. Check for existing pending request
        const existingConnection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId, status: "pending" },
                { sender: receiverId, receiver: senderId, status: "pending" }
            ]
        }).session(session);

        if (existingConnection) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Request already exists" });
        }

        // 6. Create new connection
        const newRequest = await Connection.create([{
            sender: senderId,
            receiver: receiverId,
            status: "pending"
        }], { session });

        // 7. Emit socket events
        const receiverSocketId = userSocketMap.get(receiverId.toString());
        const senderSocketId = userSocketMap.get(senderId.toString());

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('statusUpdate', {
                updatedUserId: senderId,
                newStatus: "received"
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit('statusUpdate', {
                updatedUserId: receiverId,
                newStatus: "pending"
            });
        }

        await session.commitTransaction();
        return res.status(200).json(newRequest[0]);

    } catch (err) {
    console.error('Detailed connection error:', {
      message: err.message,
      stack: err.stack,
      rawError: err
    });
    
    // Ensure JSON response
    res.status(500).json({
      error: 'Connection failed',
      details: err.message
    });
  }
};

export const acceptConnection = async(req,res)=>{
    try{
        let {connectionId} = req.params
        
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({msg:'connection does not exist'})
        }
        if(connection.status !== "pending"){
            return res.status(400).json({msg:"request under process"})
        }
        connection.status="accepted"
        await connection.save()
        await User.findByIdAndUpdate(req.userId,{
            $addToSet:{connection:connection.sender._id}
        })
        await User.findByIdAndUpdate(connection.sender._id,{
            $addToSet:{connection:req.userId}
        })

        let receiverSocketId = userSocketMap.get(connection.receiver._id.toString())
        let senderSocketId = userSocketMap.get(connection.sender._id.toString())

        //make an event to update the status
        if(receiverSocketId){
            io.to(receiverSocketId).emit('statusUpdate',{updatedUserId:connection.sender._id,newStatus:"disconnect"})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit('statusUpdate',{updatedUserId:req.userId,newStatus:"disconnect"})
        }


        return res.status(200).json({msg:`connection accepted`})
    
    }catch(err){
        return res.status(500).json({msg:`error while accepting ${err}`})
    }
}


export const rejectConnection = async(req,res)=>{
    try{
        let {connectionId} = req.params
        
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({msg:'connection does not exist'})
        }
        if(connection.status !== "pending"){
            return res.status(400).json({msg:"request under process"})
        }
        connection.status="rejected"
        await connection.save()


       
        return res.status(200).json({msg:`connection rejected`})
    
    }catch(err){
        return res.status(500).json({msg:`error while rejecting ${err}`})
    }
}


export const getConnectionStatus = async(req,res)=>{
    try{
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;

        // Add validation checks
        if(!targetUserId || !currentUserId) {
            return res.status(400).json({msg: 'Missing user IDs'});
        }

        let currentUser = await User.findById(currentUserId);
        
        // Check if user exists and has connections array
        if(!currentUser) {
            return res.status(404).json({msg: 'Current user not found'});
        }
        
        // Initialize connections array if it doesn't exist
        if(!currentUser.connection) {
            currentUser.connection = [];
            await currentUser.save();
        }

        // Now safe to check includes
        if(currentUser.connection.includes(targetUserId)){
            return res.json({status:"disconnect"});
        }

        // Rest of your existing code...
        
    }catch(err){
        console.error('Connection status error:', err);
        return res.status(500).json({msg: `getConnectionStatus error: ${err.message}`});
    }
}

export const removeConnection = async(req,res)=>{
    try{
       const myId = req.userId;
       const otherUserId = req.params.userId;

       await User.findByIdAndUpdate(myId,{ $pull:{connection:otherUserId}});
       await User.findByIdAndUpdate(otherUserId,{$pull:{connection:myId} });
    
     let receiverSocketId = userSocketMap.get(otherUserId)
        let senderSocketId = userSocketMap.get(myId)

        //make an event to update the status
        if(receiverSocketId){
            io.to(receiverSocketId).emit('statusUpdate',{updatedUserId:myId,newStatus:"connect"})
        }
        if(senderSocketId){
            io.to(senderSocketId).emit('statusUpdate',{updatedUserId:otherUserId,newStatus:"connect"})
        }

       return res.json({msg:"connetion removed successfully"})
    }catch(err){
        return res.status(500).json({msg:`${err}`})
    }
}


export const getConnectionRequests = async(req,res)=>{
    try{
          const userId = req.userId

          const requests = await Connection.find({receiver:userId,staus:"pending"})
          .populate("sender","firstName lastName email userName profileImage headline")

          return res.status(200).json(requests)
    }catch(err){
        return res.status(500).json({msg:`err while getting connection ${err}`})
    }
}

export const getUserConnections = async (req,res)=>{
    try{
       const userId = req.userId;

       const user = await User.findById(userId).populate(
        "connection",
        "firstName lastName userName profileImage headline connection"
       )
       return res.status(200).json(user.connection)
    }catch(err){
        return res.status(500).json({msg:`${err}`})
    }
}