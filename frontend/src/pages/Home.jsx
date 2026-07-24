import Button from "../components/Button";
import {useNavigate} from "react-router-dom";


function Home(){

const navigate = useNavigate();


return(

<section className="home">


<h1>
AI Powered Interview Platform
</h1>


<p>
Practice technical interviews,
get AI feedback and improve your skills.
</p>


<Button
onClick={()=>navigate("/track")}
>

Start Interview

</Button>


</section>

)

}


export default Home;