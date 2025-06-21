const express=require("express");
const Complaint=require("../models/complaints");
const User=require("../models/user");
const {verifyToken}=require("../Controllers/Auth.webtoken");

let io;
const router=express.Router();
router.setSocketIO=(socketIOInstance=>{
    io=socketIOInstance;
})

router.post('/complaint',verifyToken,async(req,res)=>{
    const {title,description,productName,purchaseDate,contactDetails,attachments}=req.body?.data;
    console.log(req.body);
    const id=req.user.id;
    try{
        const newComplaint=new Complaint({
            userId:id,
            title,
            description,
            productName,
            purchaseDate,
            contactDetails,
            attachments,
            timelineEvents: [{
                eventType: 'Complaint Registered',
                description: `Complaint "${title}" registered by ${req.user.username}.`,
                actor: req.user.id,
                actorRole: req.user.role,
                timestamp: new Date(),
            }]
        })

        await newComplaint.save();
        io.to('admin_alert').emit('newComplaintRegister',{
            complaintId:newComplaint?._id,
            title:title,
            complaint:newComplaint,
            username:req.user.username
        })
        console.log(`New complaint ${newComplaint._id} registered. Notifying admins.`);
        return res.status(200).json(newComplaint);
    }
    catch (error) {
        console.error('Error submitting complaint:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})
router.get("/my",verifyToken,async(req,res)=>{
    const id=req.user.id;
    try{
        let complaints=[];
        const role=req.user.role;
        if(role==='user'){
            complaints=await Complaint({userId:id}).populate('assignedTo', 'username email')
        }
        else if(role==='agent'){
            complaints=await Complaint({assignedTo:id}).populate('userId', 'username email')
        }
        else{
        complaints=await Complaint({assignedTo:id}).populate('assignedTo', 'username email').populate('userId', 'username email')
        }
     res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get("/complaint/:id",verifyToken,async(req,res)=>{
    try{
    const complaint = await Complaint.findById(req.params.id)
                                        .populate('userId', 'username email')
                                        .populate('assignedTo', 'username email')
                                        .populate('conversations.sender', 'username email'); // Populate sender in chat

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        return  res.json(complaint);
    }
    catch (error) {
        console.error('Error fetching single complaint:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

router.put('/complaint/:id/assign',verifyToken,async(req,res)=>{
    const { agentId } = req.body;
    try{
        const complaint=await Complaint.findById(req.params.id);
        if(!complaint){
            return res.status(404).json({ message: 'Complaint not found' });
        }
        const user=await User.findById(agentId);
        if(!user||user.role!=='agent'){
            return res.status(404).json({message:"user not found/role is not a Agent"});
        }
        complaint.assignTo=agentId;
        complaint.assignedAt = new Date();
        complaint.status = 'Assigned';
        complaint.timelineEvents.push({
            eventType: 'Agent Assigned',
            description: `Complaint assigned to agent ${user.name}.`,
            actor: req.user.id,
            actorRole: req.user.role,
            timestamp: new Date(),
            oldValue: oldAssignedTo,
            newValue: user.name,
        });
        await complaint.save();
        io.to(complaint.userId.toString()).emit('complaintStatusUpdate',{
            complaintId:complaint_id,
            newStatus:complaint.status,
            assignedTo: user.name,
            timestamp: new Date(),
            complaint:complaint
        })
        console.log(`Complaint ${complaint._id} assigned. Notifying customer.`);
        io.to(user._id?.toString()).emit('newComplaintAssigned',{
            complaintId: complaint._id,
            title: complaint.title,
            customerUsername: (await User.findById(complaint.userId)).name,
            timestamp: new Date(),
        })
        console.log(`Complaint ${complaint._id} assigned. Notifying agent ${agent.username}.`);
        res.json({ message: 'Complaint assigned successfully', complaint });
    }
    catch (error) {
        console.error('Error assigning complaint:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

router.put("/complaint/:id/status",verifyToken,async(req,res)=>{
    const {status,resolutionDetails}=req.body;
    try{
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        if (req.user.role=== 'Agent' && (!complaint.assignedTo || !complaint.assignedTo.equals(req.user.id))) {
            return res.status(403).json({ message: 'Not authorized to update status for this complaint' });
        }
        const oldStatus=complaint.status;
        complaint.status = status;
        complaint.timelineEvents.push({
            eventType: 'Status Updated',
            description: `Complaint status changed from "${oldStatus}" to "${status}".`,
            actor: req.user.id,
            actorRole: req.user.role,
            timestamp: new Date(),
            oldValue: oldStatus,
            newValue: status,
        });
        if (resolutionDetails) {
            complaint.resolutionDetails = resolutionDetails;
            complaint.resolutionDate = new Date();
            complaint.timelineEvents.push({
                eventType: 'Resolution Details Added',
                description: `Resolution details updated.`,
                actor: req.user.id,
                actorRole: req.user.role,
                timestamp: new Date(),
            });
        }
        await complaint.save();
        io.to(complaint.userId.toString()).emit('complaintStatusUpdate', {
            complaintId: complaint._id,
            newStatus: complaint.status,
            resolutionDetails: complaint.resolutionDetails,
            timestamp: new Date(),
            complaint:complaint
        });
        if (complaint.assignedTo) {
            io.to(complaint.assignedTo.toString()).emit('assignedComplaintStatusUpdate', {
                complaintId: complaint._id,
                newStatus: complaint.status,
                timestamp: new Date(),
            });
        }
        console.log(`Complaint ${complaint._id} status updated to ${status}. Notifying parties.`);

        res.json({ message: 'Complaint status updated', complaint });
    }
    catch (error) {
        console.error('Error updating complaint status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports=router;