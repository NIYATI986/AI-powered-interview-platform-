import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import InterviewTrack from "../pages/InterviewTrack";
import Questions from "../pages/Questions";
import Feedback from "../pages/Feedback";
import History from "../pages/History";


function AppRoutes(){

return(

<Routes>

<Route path="/" element={<Home/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/signup" element={<Signup/>}/>

<Route path="/track" element={<InterviewTrack/>}/>

<Route path="/questions" element={<Questions/>}/>

<Route path="/feedback" element={<Feedback/>}/>

<Route path="/history" element={<History/>}/>

</Routes>

)

}


export default AppRoutes;