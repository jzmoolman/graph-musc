import React, { useState, useRef, useEffect, useContext } from 'react'
import  { Box,  Paper,} from '@mui/material'
import { ForceGraphScheme, GraphName, defaultForceGraphScheme } from '../tools/graphtools';
import { Graph } from './Graph';
import { Filters } from './Filters';
import { FinalVerdict } from '../tools/graphtools';

import { GeneCard } from '../componentsv2/GeneCard';
import { SyndromeCard } from '../componentsv2/SyndromeCard';
      // import { load_gene_affects_risk_organ } from '../data/neo4j/gene-affect-organ.neo4j';
import { Neo4jContext } from 'use-neo4j';

type GraphProps = {
    name: GraphName 
    specialist: string
    onChange?: (open: boolean) => void
    onMouseOver?: () => void
    onMouseOut?: () => void
}

type Dimension = {
    width: number
    height: number
}

export const GraphViewport = ( { 
    name, 
    specialist, 
    onChange,
    onMouseOver,
    onMouseOut
} : GraphProps) => {
    const context = useContext(Neo4jContext), driver = context.driver   

    const [graphName, setGraphName] = useState<GraphName>(name)
    const refresh = useRef(true)
    if ( refresh.current) {
        refresh.current = true;
        if ( graphName !== name) {
           setGraphName(name)
        }
    }
    
    const [graphScheme, setGraphScheme] = useState(defaultForceGraphScheme)
    
    const [genes, setGenes] = useState<string[]>([])
    const [organs, setOrgans] = useState<string[]>([])
    const [diseases, setDiseases] = useState<string[]>([])
    const [syndromes, setSyndromes] = useState<string[]>([])
    const [finalVerdict, setFinalVerdict] = useState<FinalVerdict>('Confirmed')
    const [gender, setGender] = useState<string>('Female')
    // used to display the Genecard
    const [gene, setGene] = useState<string>('None')
    // used to display the Syndromecard
    const [syndrome, setSyndrome] = useState<string>('None')
    const [dim, setDim] = useState<Dimension>( {width:600, height:600})
    //const [data, setData] = useState<any>(null);
   
    const ref = useRef<HTMLInputElement>(null)

    // const handleData = (data: any) => {
    //     console.log('--->Debug: GraphViewport.tsx.handleData data', data) 
    //     setData(data)
    // }

    // useEffect(()=>{
    //     load_gene_affects_risk_organ(driver, {onData: handleData })
    // },[gene]) 

    useEffect(()=> {
        window.addEventListener("resize", handleResize )
        const width = ref.current?ref.current.offsetWidth:0
        let height = ref.current?ref.current.offsetHeight:0
        if (height < 600) {
            height = 600;
        }
        // console.log("---->Debug: width, height", width, height)
        setDim({width, height})
    }, [])

    const handleResize = () => {
        const width = ref.current?ref.current.offsetWidth:0
        let height = ref.current?ref.current.offsetHeight:0
        // console.log("---->Debug before: width, height", width, height)
        if (height < 600) {
            height = 600;
        }
        setDim({width, height})
    }

    const handleGraphChange = (name: GraphName) => {
        refresh.current = false;
        setGraphName(() => { return name })
    }

    const handleGeneChange = (selected: string[]) => {
        setGenes(selected)
    }

    const handleOrganChange = (selected: string[]) => {
        setOrgans(selected)
    }

    const handleDiseaseChange = (selected: string[]) => {
        setDiseases(selected)
    }

    const handleSyndromeChange = (selected: string[]) => {
        setSyndromes(selected)
    }

    const handleGenderChange =(selected: string) => {
        console.log('--->Debug: GraphViewport handleGenderChange')
        setGender(selected)
    }

    const handleFinalVerdictChange = (selected: string) => {
        switch ( selected ) {
            case 'Confirmed': 
            case 'Maybe': 
            case 'Both': {
                setFinalVerdict(selected)
                break;
            }
            default: setFinalVerdict('Confirmed')
        }
    }

    const handleConfiguationChange = (graphScheme:ForceGraphScheme) => {
        setGraphScheme(graphScheme)
    }

    const handleMouseOver = () => {
        if (onMouseOver) {
            onMouseOver()
        }
    }
    const handleMouseOut = () => {
        if (onMouseOut) {
            onMouseOut()
        }
    }

    const handleGeneClick = (gene: string) => {
         console.log('---->handleGraphGeneClicked.gene', gene)
        setGene(gene)
    }

    const handleGeneCardClose = () => {
        setGene('None')
    }

    const handleSyndromeClick = (syndrome: string) => {
        console.log('---->handleGraphSyndromeClicked.gene', syndrome)
       setSyndrome(syndrome)
   }

   const handleSyndromeCardClose = () => {
       setSyndrome('None')
   }

    switch (name) { 
        case 'gene-organ':
        case 'gene-disease': 
        case 'gene-disease-subtype': {
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (syndromes.length !== 0 ) {
                setSyndromes([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
            break
        }
        case 'organ-gene': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
            if (syndromes.length !== 0 ) {
                setSyndromes([])
            }
            break
        } 
        case 'disease-gene': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (syndromes.length !== 0 ) {
                setSyndromes([])
            }
            break
        }
        case  'syndrome-disease': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
            break
        }
        case 'syndrome-gene-disease': {
            if (genes.length !== 0 ) {
                setGenes([])
            }
            if (organs.length !== 0 ) {
                setOrgans([])
            }
            if (diseases.length !== 0 ) {
                setDiseases([])
            }
        } 
    }

    return (<>
        <Paper 
            ref={ref}
            id='graph-box'
            elevation={4}         
            sx={{ 
                // display: 'flex',
                margin: '2px',
                width:'100%',
                height: '100%',
                color: 'white',
            }}
        >
            <Box  display='grid' gridTemplateColumns='auto 355px' >
                <Graph 
                    width={dim.width-358}
                    height={dim.height-5}
                    name={graphName}
                    specialist={specialist}
                    genes={genes}
                    organs={organs}
                    syndromes={syndromes}
                    diseases={diseases}
                    finalVerdict={finalVerdict}
                    gender={gender}
                    graphScheme={graphScheme}
                    enableHover
                    enableTitle
                    enableBack
                    enableZoom
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onGeneClick={handleGeneClick}
                    onSyndromeClick={handleSyndromeClick}
                />
                <Box style={{
                        // background: 'grey',
                        background: '#f5f5f5',
                        margin: '5px'
                    }}>
                    <Filters 
                        name={graphName} 
                        specialist={specialist}
                        genes={genes} 
                        organs={organs} 
                        diseases={diseases}
                        syndromes={syndromes}
                        finalVerdict={finalVerdict}
                        gender={gender}
                        // graphScheme={graphScheme}
                        onGraphChange={handleGraphChange}
                        onGeneChange={handleGeneChange}
                        onOrganChange={handleOrganChange}
                        onDiseaseChange={handleDiseaseChange}
                        onSyndromeChange={handleSyndromeChange}
                        onGenderChange={handleGenderChange}
                        onFinalVerdictChange={handleFinalVerdictChange}
                    />
                </Box>
                
            </Box>
        </Paper>
        {gene !== 'None'?
            <GeneCard visable={true} gene={gene} onClose={handleGeneCardClose}/>:
            <></>
        }
        {syndrome !== 'None'?
            <SyndromeCard visable={true} syndrome={syndrome} onClose={handleSyndromeCardClose}/>:
            <></>
        }
    </>
    )
}
