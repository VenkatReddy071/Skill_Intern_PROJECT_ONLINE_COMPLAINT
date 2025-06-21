const Complaint=require("../models/complaints");
const jwt=require("jsonwebtoken");
const User=require("../models/user");
const SocketHandler=(io)=>{
    io.use(async(socket,next)=>{
        const token=socket.handshake.auth.token;
        if(!token){
            console.warn('Socket Auth Error: No token provided');
            return next(new Error('Authentication error: No token provided'));
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userRole = decoded.role;
            const user=await User.findById(socket.userId);
            if(!user){
                console.log('error user not found',user);
                return next(Error("User not found error"));
            }
            socket.username=user.username;
            socket.isAdmin=user.role==='admin';
            socket.iaAgent=user.role==='agent';

            socket.join(socket.userId.toString());
            console.log(`user connected to a session ${socket.username}`);

            if (socket.isAdmin) {
                socket.join('admin_alerts');
                console.log(`Admin ${socket.username} joined 'admin_alerts' room.`);
            }

            next();
        }
        catch (err) {
            console.error('Socket Auth Error: Invalid token:', err.message);
            return next(new Error('Authentication error: Invalid token'));
        }
    })

    io.on('connection',(socket)=>{
        console.log(`connected to a Session`,socket.id);
        socket.on('JoinComplaintCant',async(complaintId)=>{
            try{
            const complaint=await Complaint.findById(complaintId);
            if (!complaint) {
                    return socket.emit('chatError', 'Complaint not found');
            }
            const isAuthorized = (
                    socket.userId.equals(complaint.userId) ||
                    (complaint.assignedTo && socket.userId.equals(complaint.assignedTo)) ||
                    socket.isAdmin 
                );
                if (!isAuthorized) {
                    return socket.emit('chatError', 'You are not authorized to join this chat.');
                }
                socket.join(complaintId);
                console.log(`${socket.username} joined chat for complaint: ${complaintId}`);
                const populatedComplaint = await Complaint.findById(complaintId)
                    .populate('conversations.sender', 'username email');
                socket.emit('pastMessages', populatedComplaint.conversations);
            }
            catch (error) {
                console.error('Error joining complaint chat:', error);
                socket.emit('chatError', 'Failed to join chat.');
            }
        })
        socket.on('chatMessage',async(complaintId,message)=>{
            if (!message || message.trim() === '') {
                return;
            }
            try {
                const complaint = await Complaint.findById(complaintId);
                if (!complaint) {
                    return socket.emit('chatError', 'Complaint not found for sending message');
                }
                let onModel;
                if (socket.isAdmin) {
                    onModel = 'Admin';
                } else if (socket.isAgent) {
                    onModel = 'Agent';
                } else {
                    onModel = 'User';
                }

                 const newMessage = {
                    sender: socket.userId,
                    onModel: onModel,
                    message: message.trim(),
                    timestamp: new Date(),
                };
                complaint.conversations.push(newMessage);
                await complaint.save();
                const populatedMessage = {
                    ...newMessage,
                    sender: {
                        _id: socket.userId,
                        username: socket.username,
                        email: (await User.findById(socket.userId)).email // Fetch email if needed
                    }
                };
                 if (complaint.assignedTo) {
                    io.to(complaintId).emit('newMessage', populatedMessage);
                    console.log(`Message sent in assigned complaint ${complaintId} by ${socket.username}.`);
                
                 if (onModel === 'User' && !socket.userId.equals(complaint.assignedTo)) {
                         io.to(complaint.assignedTo.toString()).emit('newChatNotification', {
                             complaintId: complaint._id,
                             sender: socket.username,
                             message: message.trim(),
                             isAssignedChat: true
                         });
                    }
                    if (onModel === 'Agent' && !socket.userId.equals(complaint.userId)) {
                         io.to(complaint.userId.toString()).emit('newChatNotification', {
                             complaintId: complaint._id,
                             sender: socket.username,
                             message: message.trim(),
                             isAssignedChat: true
                         });
                        }
                    }
                    else {
                    
                    io.to('admin_alerts').emit('newMessage', {
                        ...populatedMessage,
                        complaintId: complaint._id,
                        isUnassigned: true
                    });
                    console.log(`Message for unassigned complaint ${complaint._id} by ${socket.username}. Notifying admins.`);
                    socket.emit('messageSent', populatedMessage);
                }
            }
            catch (error) {
                console.error('Error sending message:', error);
                socket.emit('chatError', 'Failed to send message.');
            }
        })
        socket.on('disconnect', () => {
            console.log(`User disconnected (Socket.IO): ${socket.username} (${socket.userId})`);
        });
    })
}
module.exports=SocketHandler;