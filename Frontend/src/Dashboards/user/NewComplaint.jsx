import React from 'react'
import AddComplaintForm from "../../Pages/Dashboard/AddComplaintForm"
import axiosInstance from "../../api/AxiosInstance"
export const NewComplaint = () => {
    const handleComplaintSubmit=async(data)=>{
      console.log(data);
    try{
    const response= await axiosInstance.post('/api/complaint',{data});
    if(response.status===200 ||response.status===201){
      console.log(response.data);
      return true;
    }
    else{
      console.log("error");
      return false;
    }
  }
  catch(error){
    console.log(error);
    return false;
  }
    }
    const onFormCancel=()=>{
        console.log("cancle");
    }
  return (
    <AddComplaintForm
      onComplaintSubmit={handleComplaintSubmit}
      onCancel={onFormCancel}
    />
  )
}
