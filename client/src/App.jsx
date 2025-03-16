import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path='/login' exact element={<Login/>}/>
          <Route path='/signup' exact element={<SignUp/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App