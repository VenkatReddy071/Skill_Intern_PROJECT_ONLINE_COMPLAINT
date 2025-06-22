import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {ComplaintDetailInfo} from "./ComplaintDetailInfo.jsx"
import ComplaintChatSection from "./ComplaintChatSection.jsx"
export const ComplaintDetailContent = ({ complaint }) => {
    const {user}=useAuth();
     if (!complaint) {
        return <p className="text-center text-gray-700 text-lg mt-10">Complaint not found.</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
            <div className="lg:col-span-2 flex flex-col space-y-6">
                <ComplaintDetailInfo complaint={complaint} currentUserId={user?._id} />
            </div>

            <div className="lg:col-span-1 flex flex-col h-full">
                <ComplaintChatSection
                    complaintId={complaint?._id}
                    currentConversations={complaint.conversations}
                />
            </div>
        </div>
    )
};