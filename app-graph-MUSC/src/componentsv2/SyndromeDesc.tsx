
import React from 'react'
import { Box } from '@mui/material'
import { SyndromeNode } from '../data/forcegraph/types.forcegraph'
import {Interweave} from 'interweave';


type SyndromeDescProps = {
    syndrome: SyndromeNode
}


export const SyndromeDesc = ({syndrome}:SyndromeDescProps) => {
    console.log('----->Debug: SyndromeDesc.gene ', syndrome)


    return (<div> 
        {syndrome?<>
        <div>
            <span>
                <b> Fullname:</b> {syndrome.name}
            </span>
        </div>
        <br></br>
        <div>
            <span>
                <b>Alternative Name:</b> {syndrome.name}
            </span>
                <br></br>
        </div>
        <div style={{height:20}}>
        </div>
        <Box sx={{fontWeight: 'bold'}}>
                Description
        </Box>
        <div>
                {syndrome.verbiages}
        </div>
        </>
        :<span>Loading ...</span>}
      </div>
    )


}