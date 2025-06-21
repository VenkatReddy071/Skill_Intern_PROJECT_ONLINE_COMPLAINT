import React, { useState, useEffect } from 'react';

export const TimelineItem = ({ event, currentUserId }) => {
    const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
    };

  const isMessage = event.type === 'Message';
  const isMyMessage = isMessage && event.sender && event.sender._id === currentUserId;

  return (
    <div className={`relative mb-6 ${isMessage ? (isMyMessage ? 'flex justify-end' : 'flex justify-start') : ''}`}>
      {!isMessage && (
        <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full z-10 border-2 border-white"></div>
      )}
      <div className={`ml-6 ${isMessage ? 'max-w-[70%]' : 'w-full'}`}>
        <div className={`flex items-center mb-1 ${isMyMessage ? 'justify-end' : ''}`}>
          {!isMessage && <span className="text-lg mr-2">{event.icon}</span>}
          <h4 className="font-semibold text-gray-800 text-md">{event.type}</h4>
          <span className="ml-auto text-xs text-gray-500">{formatDate(event.timestamp)}</span>
        </div>
        {isMessage ? (
          <div className={`p-3 rounded-xl shadow-sm relative ${
            isMyMessage ? 'bg-blue-500 text-white ml-auto rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}>
            <p className="text-xs text-opacity-80 mb-1">
              {event.sender && (
                <span className={`font-semibold mr-1 ${isMyMessage ? 'text-white' : ''}`}>
                  {event.sender.name} ({event.sender.role}):
                </span>
              )}
            </p>
            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isMyMessage ? 'text-white' : 'text-gray-700'}`}>
              {event.details}
            </p>
          </div>
        ) : (
          <p className="text-gray-700 text-sm leading-relaxed">
            {event.sender && (
              <span className={`font-medium mr-1 ${
                  event.sender.role === 'Customer' ? 'text-indigo-600' :
                  event.sender.role === 'Agent' ? 'text-green-600' :
                  event.sender.role === 'Admin' ? 'text-purple-600' : 'text-gray-700'
              }`}>
                {event.sender.name} ({event.sender.role}):
              </span>
            )}
            {event.details}
          </p>
        )}
      </div>
    </div>
  );
};