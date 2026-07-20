import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/Card";
import Button from "../components/Button";


function InterviewTrack(){

const navigate = useNavigate();


const tracks=[

{
title:"Frontend Developer",
description:"React, JavaScript, CSS, UI Development"
},

{
title:"Backend Developer",
description:"Node.js, Express, Databases, APIs"
},

{
title:"AI Engineer",
description:"Machine Learning, LLMs, AI Systems"
},

{
title:"Data Scientist",
description:"Python, Statistics, Data Analysis"
}

];


const [selected,setSelected]=useState(null);



return(

<div className="track-page">


<h1>
Choose Interview Track
</h1>


<p>
Select the role you want to practice
</p>



<div className="track-container">


{
tracks.map((track,index)=>(


<Card key={index}>


<h2>
{track.title}
</h2>


<p>
{track.description}
</p>



<button

className={
selected===index
?
"selected"
:
"select-btn"
}


onClick={()=>setSelected(index)}

>

{
selected===index
?
"Selected"
:
"Select"
}


</button>


</Card>


))

}


</div>



<Button

onClick={()=>navigate("/questions")}

>

Start Interview

</Button>



</div>


)

}


export default InterviewTrack;