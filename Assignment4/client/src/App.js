import MainPg from './pages/MainPg';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
<<<<<<< HEAD
import Admin from './pages/Admin';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
=======

import CharacterList from './pages/collectiveverse';

import MedalShop from './pages/MedalShop';




>>>>>>> Anees
import{BrowserRouter as Router,Routes,Route} from "react-router-dom";

function App() {
 return (
   <Router>
       <Routes>
         <Route path="/" element={<MainPg />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/SignUp" element={<SignUp />} />
         <Route path="/Home" element={<Home />} />
<<<<<<< HEAD
         <Route path="/Admin" element={<Admin />} />
         <Route path="/AdminSignup" element={<AdminSignup />} />
         <Route path="/AdminLogin" element={<AdminLogin />} />
=======
         <Route path="/collectiveverse" element={<CharacterList />} />
         <Route path="/MedalShop" element={<MedalShop />} />
>>>>>>> Anees
       </Routes>
   </Router>
   
 );
}

export default App;
