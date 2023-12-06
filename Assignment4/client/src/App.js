import MainPg from './pages/MainPg';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import{BrowserRouter as Router,Routes,Route} from "react-router-dom";

function App() {
 return (
   <Router>
       <Routes>
         <Route path="/" element={<MainPg />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/SignUp" element={<SignUp />} />
         <Route path="/Home" element={<Home />} />
       </Routes>
   </Router>
   
 );
}

export default App;
