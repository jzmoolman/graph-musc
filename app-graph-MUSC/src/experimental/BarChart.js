import { useEffect, useRef } from "react"
import { zBarChart } from "./zd3"

import './ForceGraph.css'


export const ZBarChart = ({data}) => {
    const ref = useRef(null);
    useEffect(()=>{
        const atm = data.find(d=> d.id === 'ATM')
        console.log('AT', atm)
    },[])


        
    return (<>
    <div ref={ref}>
        {/* <button onClick={update}>Variable 1</button> */}
    </div>
    <div>
        {/* <svg id="graph-contrainer" width={500}  height={500} ref={ref}>
        </svg> */}
    </div>
    </>)
}

