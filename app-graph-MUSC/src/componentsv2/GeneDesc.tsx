

import { Box } from '@mui/material'
import React, { 
    useContext,
    useEffect,
    useState } from 'react'
import { Neo4jContext } from 'use-neo4j'
import { GeneNode, loadGenesV2 } from '../data/gene.neo4j'


type GeneDescProps = {
    gene: string
}

export const GeneDesc = ({gene}:GeneDescProps) => {
    console.log('----->Debug: GeneDesc.gene ', gene)

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<GeneNode[]>([])

    function handleData(data:GeneNode[]) {
        console.log('----->handleData', data)
        setData(data)
    }
    
    useEffect(()=>{
        loadGenesV2(driver, { filter: [gene], onData: handleData })
    },[])


    return (<div> 
        {data.length === 1?<>
        <div>
            <span>
                <b> Fullname:</b> {data[0].fullName}
            </span>
        </div>
        <div>
            <span>
                <b>Alternative Name:</b> {data[0].altName}
            </span>
                <br></br>
        </div>
        <div style={{height:20}}>
        </div>
        <Box sx={{fontWeight: 'bold'}}>
                Description
        </Box>
        <div>
                {data[0].description}
        </div>
        </>
        :<span>Loading ...</span>}
      </div>
    )


}