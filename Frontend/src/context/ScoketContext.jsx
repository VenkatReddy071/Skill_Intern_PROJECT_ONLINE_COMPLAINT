import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from "axios"
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const token=localStorage.getItem('jwtToken');
    const [socket, setSocket] = useState(null);
    const notificationsRef = useRef([]);
    const [user,setUser]=useState('');
    const url=import.meta.env.VITE_SERVER_URL
      useEffect(()=>{
      axios.get(`${url}/api/das/profile`,{headers:{Authorization:`Bearer ${token}`},withCredentials:true})
      .then((response)=>{
        console.log(response.data);
        setUser(response.data);
      })
      .catch((error)=>{
        console.log(error);
      })
      },[])
    useEffect(() => {
        if (token) {
            const newSocket = io("http://localhost:3000", {
                auth: {
                    token: token,
                },
                withCredentials:true,
                transports: ['websocket', 'polling'],
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });
            newSocket.on('newComplaintRegistered', (data) => {
                if (user && user.role === 'Admin') {
                    console.log('Admin: New complaint registered!', data);
                    notificationsRef.current = [...notificationsRef.current, { type: 'newComplaint', data }];
                    alert(`New Complaint! ID: ${data.complaintId.substring(0, 8)}... by ${data.username}`);
                }
            });

            newSocket.on('complaintStatusUpdate', (data) => {
                if (user && user._id === data.userId) {
                    console.log('Customer: Complaint status updated!', data);
                    notificationsRef.current = [...notificationsRef.current, { type: 'statusUpdate', data }];
                    alert(`Complaint ${data.complaintId.substring(0, 8)}... status updated to: ${data.newStatus}`);
                }
            });

            newSocket.on('newComplaintAssigned', (data) => {
                if (user && user.role === 'Agent' && user._id === data.assignedTo) {
                    console.log('Agent: New complaint assigned!', data);
                    notificationsRef.current = [...notificationsRef.current, { type: 'newAssignment', data }];
                    alert(`New complaint assigned to you! ID: ${data.complaintId.substring(0, 8)}...`);
                }
            });

            newSocket.on('newChatNotification', (data) => {
                console.log('New chat message notification!', data);
                notificationsRef.current = [...notificationsRef.current, { type: 'newChatMessage', data }];
                alert(`New message in complaint ${data.complaintId.substring(0,8)}... from ${data.sender}: "${data.message}"`);
            });


            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                console.log('Socket disconnected.');
            };
        } else if (!token || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [token, user]);

    return (
        <SocketContext.Provider value={{ socket, notifications: notificationsRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);