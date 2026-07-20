import { useState } from "react";


function Input({
    type="text",
    placeholder,
    value,
    onChange,
    name
}){

const [showPassword,setShowPassword] = useState(false);


const inputType = 
type === "password" && showPassword
? "text"
: type;


return(

<div className="input-wrapper">

<input

className="input"

type={inputType}

placeholder={placeholder}

value={value}

name={name}

onChange={onChange}

/>


{
type==="password" &&

<button

type="button"

className="show-btn"

onClick={()=>setShowPassword(!showPassword)}

>

{
showPassword ? "Hide" : "Show"
}

</button>

}


</div>

)

}


export default Input;