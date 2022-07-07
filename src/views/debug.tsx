import { runMain } from "module"
import React, { useRef } from "react"
import { useState, useEffect } from "react"
import { setConstantValue } from "typescript"




const loadData  = async (handleDataReady: () => void) => {
    console.log('enter - loadData')
    
    const tmp = new Promise( resolve => setTimeout(resolve, 5000) )
    await tmp;
    handleDataReady();
    console.log('exit - loadData')
    
}

const useData = () => {
    console.log('enter - useData')

    const [count, setCount] = useState(0)
    console.log('count', count)
    

    useEffect( () => {
        let mount = true
        const handleDataReady = () => {
            
            console.log('handleData - useData')
            if (mount) {
               setCount(count+1)
            } else {
                console.log('dropping data, component dismounted - useData')

            }
        }

        loadData(handleDataReady)
        return () => { mount = false }
    } ,[])
    
    console.log('exit - useData')

    return <div>{count}</div>
}

export const Debug = () => {
    console.log('enter - Debug')
    
    const ret = useData()

    console.log('exit - Debug')
    return (
        <div>
         TEST DATA {ret}
        </div>
    )

}