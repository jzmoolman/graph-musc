
import React from 'react'
import { SyndromeNode } from '../data/forcegraph/types.forcegraph'


type SyndromeDescProps = {
    syndrome: SyndromeNode
}


export const SyndromeDesc = ({syndrome}:SyndromeDescProps) => {
    console.log('----->Debug: SyndromeDesc.gene ', syndrome)
    let produced_by : JSX.Element | undefined
    
    if(syndrome.google_drive_link !== undefined){
        produced_by  = <> <div key={"1"} className="NCCNCard">
        Produced by AI (ChatGPT)    
        <br/>
        Prompts created by Emalie Houk, Kiersten Meeder
        <br/>
        ChatGPT queries by Nicole Uzzo, Emalie Houk
        <br/>
        Reviewed for accuracy by Nicole Uzzo, Emalie Houk
        <br/>
        Please make any suggestions regarding accuracy to keh270@MUSC.edu
    </div></>
    }

    return (<div> 
        {syndrome?<>
        <div>
            <iframe src={syndrome.google_drive_link} width='100%' height='800px' frameBorder='0'></iframe>

        </div>
        {produced_by}             
        </>
        :<span>Loading ...</span>}
      </div>
    )


}