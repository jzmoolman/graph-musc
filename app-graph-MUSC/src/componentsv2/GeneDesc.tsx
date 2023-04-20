
import React, { 
    useContext,
    useEffect,
    useState } from 'react'
import { Neo4jContext } from 'use-neo4j'
import { Box } from '@mui/material'
import { Gene, loadGenes } from '../data/gene.neo4j'
import { Gene_OrganRisks } from '../data/neo4j/gene-affect-organ.neo4j'


type GeneDescProps = {
    gene: Gene_OrganRisks
}

export const GeneDesc = ({gene}:GeneDescProps) => {
    console.log('----->Debug: GeneDesc.gene ', gene)


    return (<div> 
        {gene?<>
        <div>
            <span>
                <b> Fullname:</b> {gene.gene.fullName}
            </span>
        </div>
        <div>
            <span>
                <b>Alternative Name:</b> {gene.gene.altName}
            </span>
                <br></br>
        </div>
        <div style={{height:20}}>
        </div>
        <Box sx={{fontWeight: 'bold'}}>
                Description
        </Box>
        <div>
                {gene.gene.description}
        </div>
        </>
        :<span>Loading ...</span>}
      </div>
    )


}