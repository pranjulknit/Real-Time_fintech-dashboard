import  { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch,RootState } from '../../store';

import { login } from '../../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const {loading,error} = useSelector((state:RootState) =>state.auth);
    const navigate = useNavigate();
    const handleloginSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        const result = await dispatch(login({email,password}));
        console.log("result ",result);
        if(login.fulfilled.match(result)){
            console.log("login success");
            console.log("token ",result.payload);
            navigate("/dashboard");
        }else{
            console.log("login falied");
            console.error("signup failed");
            navigate("/error",{state:{error:result.payload as string || "Login Failed"}});
        }
    }

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-200'>

        <form action="" onSubmit={handleloginSubmit} className='bg-white shadow-md  rounded px-8 pt-6  pb-8  mb-4'>
            <h2 className='text-2xl font-bold mb-6'>Login</h2>
            {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
            <input className='border rounded w-full py-2  px-3  mb-4'
            type='email' placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <input className='border rounded w-full py-2  px-3  mb-4'
            type='password' placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)}/>
            <button type='submit' className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded 
                ${loading ? "opacity-50 cursor-not-allowed":""}`} disabled={loading}>
                    {loading?"Logging in...":"Login"}
            </button>
        </form>

        <Link to="/register">
            <button className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'>
                Sign Up
            </button>
        </Link>

    </div>
  )
}

export default LoginPage;