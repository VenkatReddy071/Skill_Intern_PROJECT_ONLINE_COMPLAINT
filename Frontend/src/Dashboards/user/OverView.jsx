import react,{useEffect,useState} from "react"
import axios from "axios"
import {DashboardOverviewPage} from "../../Pages/Dashboard/OverViewPage"
import axiosInstance from "../../api/AxiosInstance";
import { useSocket } from "../../context/ScoketContext"
import { useAuth } from "../../context/AuthContext";
export const UserOverviewPage=()=>{
    const {socket}=useSocket();
    const { user }=useAuth();
    const [pending,setPending]=useState(0);
    const [total,setTotal]=useState(0);
    const [resolved,setResolved]=useState(0);
    const token=localStorage.getItem('jwtToken');
    const fetch=async()=>{
        const response=await axiosInstance.get("/api/list",{headers:{Authorization:`Bearer ${token}`}});
        if(response.status===200){
            setPending(response.data.pending);
            setTotal(response.data.total);
            setResolved(response.data.resolved);
        }
        else{
            alert("feching error");
        }

    }
    useEffect(()=>{
        fetch();
    },[])
    return(
        <>
        <div>
            <DashboardOverviewPage heading1={"Total Submissions"} heading2={"Pending Submissions"} heading3={"Resolved Submissions"} total={total} pending={pending} resolved={resolved}/>
        </div>
        </>
    )
}
