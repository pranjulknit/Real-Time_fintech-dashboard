

import Dashboard from '../../frontend/src/Components/Dashboard';

import { BrowserRouter,Route, Routes } from 'react-router-dom';
import LoginPage from './Components/Auth/LoginPage';
import SignupPage from './Components/Auth/SignupPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './Components/Home';
import ErrorPage from './Components/ErrorPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/error' element={<ErrorPage/>}/>
        </Routes>
      </BrowserRouter>
     
   
      
     
    </div>
  );
}

export default App;
