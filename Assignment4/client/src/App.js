import MainPg from './pages/MainPg';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

import CharacterList from './pages/collectiveverse';

import MedalShop from './pages/MedalShop';




import{BrowserRouter as Router,Routes,Route} from "react-router-dom";

function App() {
 return (
   <Router>
       <Routes>
         <Route path="/" element={<MainPg />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/SignUp" element={<SignUp />} />
         <Route path="/Home" element={<Home />} />
         <Route path="/collectiveverse" element={<CharacterList />} />
         <Route path="/MedalShop" element={<MedalShop />} />
       </Routes>
   </Router>
   
 );
}

export default App;
