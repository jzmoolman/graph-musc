
import React from 'react'
import { Box } from '@mui/material'
import { GeneNode } from '../data/forcegraph/types.forcegraph'
import {Interweave} from 'interweave';


type GeneDescProps = {
    gene: GeneNode
}


export const GeneDesc = ({gene}:GeneDescProps) => {
    //console.log('----->Debug: GeneDesc.gene ', gene)

    let description: string
    let pmids: string[]
    let references: string[]
    let tmpReferences: string | undefined
    let htmlReferences: any[] = []

    if (gene != undefined){

        description = gene.description;

        //console.log('----->Debug: GeneDesc.gene.description', description)

        if (description != undefined){        
        pmids = gene.pmids.split("|")

        //console.log('----->Debug: GeneDesc.gene.pmids', pmids)

        references = gene.references.split("|")

        //console.log('----->Debug: GeneDesc.gene.references', references)

        for (var i = 0; i < pmids.length; i++) {

            if(description.includes(pmids[i] + ',')){
                description = description.replaceAll(pmids[i] + ',', `<sup STYLE="font-size:50%"> <a href="https://pubmed.ncbi.nlm.nih.gov/${pmids[i]}/" target="_blank"> [${i + 1}] </a></sup>`);

            } 
            
            if (description.includes(pmids[i] + ')')) {

                description = description.replaceAll(pmids[i] + ')', `<sup STYLE="font-size:50%"> <a href="https://pubmed.ncbi.nlm.nih.gov/${pmids[i]}/" target="_blank"> [${i + 1}] </a></sup>`);

            }

            tmpReferences = references.find((element) => element.includes(pmids[i]))

            if (tmpReferences !== undefined){
                tmpReferences = tmpReferences.replace(pmids[i] + ')', '')
                let html = `https://pubmed.ncbi.nlm.nih.gov/${pmids[i]}/`
                htmlReferences.push(<li key={pmids[i]}>{<><a href={html} target="_blank"> {'[' + (i + 1) + ']'} </a> {tmpReferences};
                </>}</li>)
            }
        }

       // console.log('----->Debug: GeneDesc.gene.listReferences', htmlReferences)

        description = description.replaceAll(' (PMID:', '');


        }


    }

    return (<div> 
        {gene?<>
        <div>
            <span>
                <b> Fullname:</b> {gene.fullName}
            </span>
        </div>
        <br></br>
        <div>
            <span>
                <b>Alternative Name:</b> {gene.altName}
            </span>
                <br></br>
        </div>
        <div style={{height:20}}>
        </div>
        <Box sx={{fontWeight: 'bold'}}>
                Description:
        </Box>
        <br />
        <div>
            
            <Interweave content={description!} />
        </div>
        <div>
            <br />
            <span>
                <b>References: </b> 

                <ul style={{listStyleType:'none', paddingLeft: 0}}>

                {htmlReferences!}
                
                </ul>  
    
            </span>
            
        </div>
        </>
        :<span>Loading ...</span>}
      </div>
    )


}