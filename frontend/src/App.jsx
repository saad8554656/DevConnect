import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Login from './components/pages/Login'
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import CreateProfile from './components/pages/CreateProfile';
import AddPost from './components/pages/Addpost';
import EditProfile from './components/pages/EditProfile';
import AdminPage from './components/pages/Admin';
import Home from './components/pages/Home';
import HomeIn from './components/pages/HomeIn';

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/home' element={<HomeIn/>} />
        <Route path="/profile" element={<Dashboard/>}/>
        <Route path='/create-profile' element={<CreateProfile/>}/>
        <Route path="/add-post" element={<AddPost/>}/>
        <Route path='edit-profile' element={<EditProfile/>}/>
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
    </Router>
  )
}

export default App
