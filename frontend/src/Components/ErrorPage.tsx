
import {  useLocation } from 'react-router-dom';

const ErrorPage = () => {
    const location = useLocation();
    const errorMessage  = location.state?.error || "An Unexpected error";

  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='bg-red-100 p-6 rounded-md'>
            <h2 className='text-8xl font-bold text-red-600 mb-4'>404</h2>
            <p className='text-red-500'>{errorMessage}</p>
        </div>
    </div>
  )
}

export default ErrorPage;