import { BrowserRouter ,Route,Routes} from "react-router";
import Register from './User/Register'
import Login from "./User/Login";

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route  path="register" element={<Register/>}/>
      <Route  path="login" element={<Login/>}/>
    </Routes>
    
    
    </BrowserRouter>
    </>
  )
}

export default App
