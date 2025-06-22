import React, { useEffect, useState } from 'react';
import { InfoField } from "./InfoField";
import { TimelineItem } from "./TimelineItem";

export const ComplaintDetailInfo = ({ complaint, currentUserId }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getRoleDisplayName = (role) => {
        if (Array.isArray(role)) {
            role = role[0];
        }
        switch (role?.toLowerCase()) {
            case 'user': return 'Customer';
            case 'agent': return 'Agent';
            case 'admin': return 'Admin';
            default: return 'Unknown';
        }
    };

    const [timelineEvents, setTimelineEvents] = useState([]);

    useEffect(() => {
        if (!complaint) return;

        const events = [];

        events.push({
            type: 'Complaint Submitted',
            timestamp: complaint.createdAt,
            details: 'Complaint successfully registered.',
            sender: complaint.userId ? { _id: complaint.userId._id, name: complaint.userId.username, role: getRoleDisplayName(complaint.userId.role) } : null,
            icon: '📝'
        });

        if (complaint.assignedTo && complaint.assignedAt) {
            events.push({
                type: 'Assigned to Agent',
                timestamp: complaint.assignedAt,
                details: `Complaint assigned to ${complaint.assignedTo.username}.`,
                sender: complaint.assignedTo ? { _id: complaint.assignedTo._id, name: complaint.assignedTo.username, role: getRoleDisplayName(complaint.assignedTo.role) } : null,
                icon: '🧑‍💼'
            });
        }

        complaint.conversations.forEach(conv => {
            console.log(conv);
            events.push({
                type: 'Message',
                timestamp: conv.timestamp,
                details: conv.message,
                sender: conv.sender ? { _id: conv.sender._id, name: conv.sender.username, role: getRoleDisplayName(conv.onModel.toLowerCase()) } : null,
                icon: '💬'
            });
        });

        if (complaint.status === 'Resolved' && complaint.resolutionDate) {
            events.push({
                type: 'Complaint Resolved',
                timestamp: complaint.resolutionDate,
                details: `Complaint has been resolved. Resolution: ${complaint.resolutionDetails}`,
                sender: complaint.assignedTo ? { _id: complaint.assignedTo._id, name: complaint.assignedTo.username, role: getRoleDisplayName(complaint.assignedTo.role) } : null,
                icon: '✅'
            });
        }

        if (complaint.feedback && complaint.feedback.submittedAt) {
            events.push({
                type: 'Feedback Provided',
                timestamp: complaint.feedback.submittedAt,
                details: `Customer provided feedback (${complaint.feedback.rating} stars): "${complaint.feedback.comments}"`,
                sender: complaint.userId ? { _id: complaint.userId._id, name: complaint.userId.username, role: getRoleDisplayName(complaint.userId.role) } : null,
                icon: '⭐'
            });
        }

        events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setTimelineEvents(events);
    }, [complaint]);

    if (!complaint) return null;

    return (
        <>
            <div className="bg-white rounded-lg shadow-inner border border-gray-100 p-6 h-full">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Complaint Details</h2>

                <InfoField label="Complaint ID" value={complaint._id} />
                <InfoField label="Subject" value={complaint.title} />
                <InfoField label="Status" value={complaint.status} statusColor={complaint.status} />
                <InfoField label="Submitted By" value={complaint.userId?.username || 'N/A'} />
                <InfoField label="Date Submitted" value={formatDate(complaint.createdAt)} />
                <InfoField label="Last Updated" value={formatDate(complaint.updatedAt)} />

                {complaint.productName && <InfoField label="Product Name" value={complaint.productName} />}
                {complaint.purchaseDate && <InfoField label="Purchase Date" value={formatDate(complaint.purchaseDate)} />}

                <h3 className="text-lg font-medium text-gray-600 mt-6 mb-2">Contact Details</h3>
                {complaint.contactDetails && (
                    <>
                        <InfoField label="Email" value={complaint.contactDetails.email} />
                        <InfoField label="Phone" value={complaint.contactDetails.phoneNumber} />
                        <InfoField label="Address" value={complaint.contactDetails.address} />
                    </>
                )}

                <h3 className="text-lg font-medium text-gray-600 mt-6 mb-2">Issue Description</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p>

                {complaint.attachments && complaint.attachments.length > 0 && (
                    <>
                        <h3 className="text-lg font-medium text-gray-600 mt-6 mb-2">Attachments</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {complaint.attachments.map((att, index) => (
                                <a key={index} href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-md transition duration-150 ease-in-out text-blue-700 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                    </svg>
                                    <span>{att.fileName}</span>
                                </a>
                            ))}
                        </div>
                    </>
                )}

                {complaint.assignedTo && (
                    <>
                        <h3 className="text-lg font-medium text-gray-600 mt-6 mb-2">Assigned To</h3>
                        <InfoField label="Agent" value={complaint.assignedTo.username} />
                        <InfoField label="Assigned On" value={formatDate(complaint.assignedAt)} />
                    </>
                )}

                {complaint.status === 'Resolved' && complaint.resolutionDetails && (
                    <>
                        <h3 className="text-lg font-medium text-gray-600 mt-6 mb-2">Resolution</h3>
                        <p className="text-gray-700 bg-green-50 p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap">{complaint.resolutionDetails}</p>
                        <InfoField label="Resolved On" value={formatDate(complaint.resolutionDate)} />
                    </>
                )}

                {complaint.feedback && (
                    <>
                        <h3 className="text-lg font-medium text-gray-600 mt-6 mb-2">Customer Feedback</h3>
                        <div className="flex items-center mb-2">
                            <span className="text-yellow-500 text-xl mr-1">{'⭐'.repeat(complaint.feedback.rating)}</span>
                            <span className="text-gray-600 text-sm">({complaint.feedback.rating} / 5)</span>
                        </div>
                        <p className="text-gray-700 bg-yellow-50 p-3 rounded-md text-sm leading-relaxed whitespace-pre-wrap">{complaint.feedback.comments}</p>
                        <InfoField label="Submitted On" value={formatDate(complaint.feedback.submittedAt)} />
                    </>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-inner border border-gray-100 p-6 mt-6 h-full">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Complaint Timeline</h2>
                <div className="relative pl-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                    {timelineEvents.map((event, index) => (
                        <TimelineItem key={index} event={event} currentUserId={currentUserId} />
                    ))}
                </div>
            </div>
        </>
    );
};