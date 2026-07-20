import {Link} from "react-router-dom";


function Navbar(){

return(

<nav className="navbar">

<h2>
AI Interview
</h2>


<div>

<Link to="/">Home</Link>

<Link to="/track">
Interview
</Link>


<Link to="/history">
History
</Link>


</div>

</nav>

)

}


export default Navbar;