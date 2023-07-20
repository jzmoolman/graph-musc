
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
        <div key={"1"} className="NCCNCard">
            Produced by AI (ChatGPT)    
            <br/>
            Prompts created by Emalie Houk, Kiersten Meeder
            <br/>
            ChatGPT queries by Nicole Uzzo, Emalie Houk
            <br/>
            Reviewed for accuracy by Nicole Uzzo, Emalie Houk
            <br/>
            Please make any suggestions regarding accuracy to keh270@MUSC.edu
        </div>
        <br/>
        <div>
            <iframe src='https://drive.google.com/file/d/14cz-yx9XXmbtq-8sjnS9boDutWh3srZs/preview' width='100%' height='800px' frameBorder='0'></iframe>

        </div>               
        </>
        :<span>Loading ...</span>}
      </div>
    )


}