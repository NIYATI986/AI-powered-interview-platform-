function ProgressBar({value}){


return(

<div className="progress">

<div
style={{
width:`${value}%`
}}
>

</div>

</div>

)

}


export default ProgressBar;