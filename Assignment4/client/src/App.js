import MainPg from './pages/MainPg';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Admin from './pages/Admin';
import{BrowserRouter as Router,Routes,Route} from "react-router-dom";

function App() {
 return (
   <Router>
       <Routes>
         <Route path="/" element={<MainPg />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/SignUp" element={<SignUp />} />
         <Route path="/Home" element={<Home />} />
         <Route path="/Admin" element={<Admin />} />
       </Routes>
   </Router>
   
 );
}

export default App;
