import {useState} from "react";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";


function Signup(){


const [form,setForm]=useState({

name:"",
email:"",
password:""

});


const [error,setError]=useState("");



const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

})

}



const submit=(e)=>{

e.preventDefault();


if(
!form.name ||
!form.email ||
!form.password
){

setError("Fill all fields");

return;

}


if(form.password.length<6){

setError("Password must be 6 characters");

return;

}


setError("");

alert("Account created");


}



return(

<div className="center">


<Card>


<h1>
Create Account
</h1>


<form onSubmit={submit}>


<Input

name="name"

placeholder="Name"

value={form.name}

onChange={handleChange}

/>



<Input

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

/>



<Input

name="password"

type="password"

placeholder="Password"

value={form.password}

onChange={handleChange}

/>


{
error &&
<p className="error">
{error}
</p>
}



<Button>
Signup
</Button>


</form>


</Card>


</div>

)


}


export default Signup;