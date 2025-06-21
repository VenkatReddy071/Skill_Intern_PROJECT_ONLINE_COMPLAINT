    import React, { useState, useEffect } from 'react';
    import {ComplaintListTable} from "../../Pages/Dashboard/ComplaintTable"
    import {ComplaintDetailContent} from "../../Pages/Dashboard/ComplaintDetail"
    export const MyComplaints = () => {
    const [viewMode, setViewMode] = useState('list');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [complaint,setComplaint]=useState([]);

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setSelectedComplaint(null);
        setViewMode('list');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br  font-inter ">
        <div className="max-w-9xl mx-auto bg-white rounded-xl  overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-gray-800">
                {viewMode === 'list' ? 'My Complaints' : 'Complaint Details'}
            </h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center">
                {viewMode === 'detail' && (
                <button
                    onClick={handleBackToList}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white font-medium rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                >
                    ← Back to List
                </button>
                )}
            </div>
            </div>

            {viewMode === 'list' ? (
            <ComplaintListTable complaints={complaint} onView={handleViewComplaint} />
            ) : (
            selectedComplaint && (
                <ComplaintDetailContent
                complaint={selectedComplaint}
                />
            )
            )}
        </div>
        </div>
    );
    };