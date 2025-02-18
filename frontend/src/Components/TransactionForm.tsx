import React,{useState} from 'react';
import axios from 'axios';
import { port } from '../config';
import { Navigate, useNavigate } from 'react-router-dom';




const TransactionForm = () => {
    const [formData, setFormData] = useState({
        amount:"",
        category:"",
        description:""
    });

    const navigate = useNavigate();

    const handleSubmit = async(e:React.FormEvent)=>{
       
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        try{

            const response = await axios.post(`http://localhost:${port}/api/transactions`,formData,{headers:{Authorization:token}});
            console.log("transaction add hua",response.data);
            alert("Transaction added successfully");
            setFormData({
                amount:"",category:"",description:""
            })
        }catch(e){
            if(e.response && e.response.status === 401){
                alert("Unauthorized. Please login again");
                navigate("/")
            }
            else{
                alert("Failed to add transaction. Please try again");
                
            }
        }
    }
    
  return (
    <form onSubmit ={handleSubmit} className="p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
        <div className="mb-4">
            <label className="black font-semibold mb-1">Amount</label>
            <input className="w-full border p2 rounded"type="number" value={formData.amount} onChange={(e)=> setFormData({...formData,amount:e.target.value})} required/>
            
        </div>
        <div className="mb-4">
            <label className="black font-semibold mb-1">Category</label>
            <input className="w-full border p-2 rounded" type="text" value={formData.category} onChange={(e)=> setFormData({...formData,category:e.target.value})} required/>
            
        </div>
        <div className="mb-4">
            <label className="black font-semibold mb-1">Description</label>
            <textarea className="w-full border p-2 rounded" name="" id="" value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})}></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Transaction
        </button>

    </form>
  )
}

export default TransactionForm


