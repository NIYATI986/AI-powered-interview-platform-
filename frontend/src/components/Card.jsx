import {motion} from "framer-motion";


function Card({children}){


return(

<motion.div

className="card"

whileHover={{
scale:1.05
}}

transition={{
duration:0.2
}}

>

{children}

</motion.div>

)

}


export default Card;