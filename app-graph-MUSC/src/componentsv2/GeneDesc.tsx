
import React from 'react'
import { Box } from '@mui/material'
import { GeneNode } from '../data/forcegraph/types.forcegraph'


type GeneDescProps = {
    gene: GeneNode
}

export const GeneDesc = ({gene}:GeneDescProps) => {
    console.log('----->Debug: GeneDesc.gene ', gene)


    return (<div> 
        {gene?<>
        <div>
            <span>
                <b> Fullname:</b> {gene.fullName}
            </span>
        </div>
        <div>
            <span>
                <b>Alternative Name:</b> {gene.altName}
            </span>
                <br></br>
        </div>
        <div style={{height:20}}>
        </div>
        <Box sx={{fontWeight: 'bold'}}>
                Description
        </Box>
        <div>
                {gene.description}
        </div>
        </>
        :<span>Loading ...</span>}
      </div>
    )


}