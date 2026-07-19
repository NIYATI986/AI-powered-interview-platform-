import { useState } from "react";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";


function Login(){

const [form,setForm] = useState({
    email:"",
    password:""
});


const [error,setError] = useState("");


function handleChange(e){

setForm({
    ...form,
    [e.target.name]: e.target.value
});

}


function handleSubmit(e){

e.preventDefault();


if(!form.email || !form.password){

setError("All fields are required");
return;

}


if(!form.email.includes("@")){

setError("Enter valid email");
return;

}


setError("");

alert("Login successful");

}



return(

<div className="center">

<Card>

<h1>
Login
</h1>


<form onSubmit={handleSubmit}>


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
Login
</Button>


</form>


</Card>


</div>

)

}


export default Login;