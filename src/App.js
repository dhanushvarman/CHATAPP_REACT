import './index.css';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Chatpage from './Components/ChatPage/Chatpage';
import ForgotPassword from './Components/Login/ForgotPassword';
import ResetPassword from './Components/Login/ResetPassword';

function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/chats' element={<Chatpage />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/forgot-password/reset/:token' element={<ResetPassword />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
