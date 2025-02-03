import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-100'>
        <h1 className='text-4xl font-bold mb-8'>Welcome to the App</h1>
        <div className='flex gap-x-4'>
            <Link to="/login">
            <button className='bg-blue-500 text-white px-6 py-2 rounded  hover:bg-blue-600'>
            Login
            </button>
            </Link>
            <Link to="/register">
            <button className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600'>
            Sign Up
            </button>
            </Link>
        </div>
    </div>
  )
}

export default Home;