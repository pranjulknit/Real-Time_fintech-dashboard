import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch,RootState } from '../../store';
import { signup } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const {loading,error} = useSelector((state:RootState)=>state.auth);
     const navigate = useNavigate();
    const handleSignupSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        const result = await dispatch(signup({email,password}));
        if(signup.fulfilled.match(result)){
            console.log("signup success");
            navigate("/login");
        }
        else if(signup.rejected.match(result)){
            console.error("signup failed");
            navigate("/error",{state:{error:result.payload as string || "Signup Failed"}});
        }
        
    }
  return (
    <div className='flex justify-center items-center h-screen'>
        <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
        onSubmit={handleSignupSubmit} >
            <h2 className='text-2xl font-bold mb-6'>Signup</h2>
            {
                error && <p className='text-red-500 text-sm '>{error}</p>
            }
            <input className='border rounded w-full py-2 px-3 mb-4' 
            type='email' placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input className='border rounded w-full py-2 px-3 mb-4'
            type='password' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button disabled={loading} type='submit' className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded
                ${loading ?"opacity-50 cursor-not-allowed":""}`}>{loading ? "Signing up...":"Signup"}</button>
        </form>
    </div>
  )
}

export default SignupPage