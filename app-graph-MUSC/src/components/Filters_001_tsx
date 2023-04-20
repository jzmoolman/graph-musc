import React, { useContext, useEffect, useState } from 'react'
import  { Box, Typography } from '@mui/material'
import { CustomSelect } from './CustomSelect'
import { GraphName, GraphScheme } from '../tools/graphtools'
import { Dropdown } from './Dropdown'
import { Neo4jContext } from 'use-neo4j'
import { loadGene, loadOrgan, loadDisease, loadSyndrome } from '../tools/graphdata'

const getGraphName = (name: string): GraphName => {
    switch (name) {
        case 'Gene - Organ': return 'gene-organ'
        case 'Gene - Disease': return 'gene-disease'
        case 'Gene - Disease - Subtype': return 'gene-disease-subtype'
        case 'Syndrome - Disease': return 'syndrome-disease'
        case 'Syndrome - Gene - Disease': return 'syndrome-gene-disease'
    }
    return 'gene-organ'
}

const getGraphDesc = (name: GraphName) => {
    switch (name) {
        case 'gene-organ': return 'Gene'
        case 'gene-disease': return 'Gene'
        case 'gene-disease-subtype': return 'Gene'
        case 'organ': return 'Organ'
        case 'disease': return 'Disease'
        case 'syndrome-disease': return 'Syndrome'
        case 'syndrome-gene-disease': return 'Syndrome'
        default: return 'Unknown'
    }
}
const getSubGraphDesc = (name: GraphName) => {
    switch (name) {
        case 'gene-organ': return 'Gene - Organ';
        case 'gene-disease': return 'Gene - Disease'
        case 'gene-disease-subtype': return 'Gene - Disease - Subtype'
        case 'syndrome-disease': return 'Syndrome - Disease'
        case 'syndrome-gene-disease': return 'Syndrome - Gene - Disease'
        default:
            return 'Gene - Organ'
        }
}

type FiltersProps = {
    name: GraphName
    specialist: string
    genes: string[]
    organs: string[]
    diseases: string[]
    syndromes: string[]
    finalVerdict: string
    graphScheme: GraphScheme
    onGraphChange?: (name: GraphName) => void
    onGeneChange?: (selcetd: string[]) => void
    onOrganChange?: (selcetd: string[]) => void
    onDiseaseChange?: (selected: string[]) => void
    onSyndromeChange?: (selected: string[]) => void
    onFinalVerdictChange?: (verdicts: string) => void
}

export const Filters = ({
        name,
        specialist,
        genes,
        organs,
        diseases, 
        syndromes, 
        finalVerdict,
        graphScheme, 
        onGraphChange,
        onGeneChange,
        onOrganChange,
        onDiseaseChange,
        onSyndromeChange,
        onFinalVerdictChange
} : FiltersProps ) => {

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<string[]>([])

    useEffect(()=> {
        switch (name) { 
            case 'gene-organ': 
            case 'gene-disease': 
            case 'gene-disease-subtype':  {
                loadGene(driver, specialist, handleData)
                break;
            }
            case 'organ': {
                loadOrgan(driver, specialist, handleData)
                break;
            }
            case 'disease': {
                loadDisease(driver, specialist, handleData)
                break;
            }
            case 'syndrome-disease':
            case 'syndrome-gene-disease': {
                loadSyndrome(driver, specialist, handleData)
            }
        }
    },[])

    const handleData = (data: string[]) => {
        setData(data)
    }

    const handleGraphChange = (name: string) => {
        if (onGraphChange) { 
            onGraphChange(getGraphName(name))
        }
    }

    const handleGeneChange = (selected: string[]) => {
        if ( onGeneChange)
            onGeneChange(selected)
    }

    const handleOrganChange = (selected: string[]) => {
        if (onOrganChange)
            onOrganChange(selected)
    }

    const handleDiseaseChange = (selected: string[]) => {
        if (onDiseaseChange)
          onDiseaseChange(selected)
    }
   
    const handleSyndromeChange = (selected: string[]) => {
        if (onSyndromeChange)
          onSyndromeChange(selected)
    }

    const handleFinalVerdictChange = (verdict: string) => {
        if (onFinalVerdictChange)
            onFinalVerdictChange(verdict)
    }

    const getOnHandleChange = (name: GraphName) => {
        switch (name) {
            case 'gene-organ':
            case 'gene-disease':
            case 'gene-disease-subtype':
                return {handleChange: handleGeneChange, selected: genes}
            case 'organ':
                return {handleChange: handleOrganChange, selected: organs}
            case 'disease':
                return {handleChange: handleDiseaseChange, selected: diseases}
            case 'syndrome-disease':
            case 'syndrome-gene-disease':
                return {handleChange: handleSyndromeChange, selected: syndromes}
            default: 
                return {handleChange: undefined, selected: []}
        }
    }


    type FilterProps = {
        name: GraphName
    }

    const HeaderDesc = ({name}: FilterProps) => {
        switch(name) {
            case 'gene-organ':
                return  (<>
                    This graph shows all [<span style={{color: graphScheme.geneNode}}>gene</span>]-
                            [<span style={{color: graphScheme.organNode}}>organ</span>] associations.
                </>)
            case 'gene-disease':
                return  (<>
                    This graph shows all [<span style={{color: graphScheme.geneNode}}>gene</span>]-
                        [<span style={{color: graphScheme.diseaseNode}}>disease</span>] associations.
                </>)
            case 'gene-disease-subtype':
                return  (<>
                    This graph shows all [<span style={{color: graphScheme.geneNode}}>gene</span>]-[<span style={{color: graphScheme.diseaseNode}}>disease</span>]-[<span style={{color: graphScheme.diseaseSubtypeNode}}>subtype</span>] associations.
                </>)
            case 'organ': 
                return (<>
                    This graph shows ALL [<span style={{color: graphScheme.organNode}}>organ</span>]-[<span style={{color: graphScheme.geneNode}}>gene</span>] associations.
                </>)
            case 'disease':
                return (<>
                    This graph shows ALL [<span style={{color: graphScheme.diseaseNode}}>disease</span>]-[<span style={{color: graphScheme.geneNode}}>gene</span>] associations.
                </>)
            case 'syndrome-disease': 
                return (<>
                    This graph shows ALL [<span style={{color: graphScheme.syndromeNode}}>Syndrome</span>]-[<span style={{color: graphScheme.diseaseNode}}>disease</span>] associations.
                </>)
            case 'syndrome-gene-disease': 
                return (<>
                    This graph shows ALL [<span style={{color: graphScheme.syndromeNode}}>Syndrome</span>]-[<span style={{color: graphScheme.geneNode}}>gene</span>]-[<span style={{color: graphScheme.diseaseNode}}>disease</span>] associations.
                </>)
            default: return  <>Undefined:  + name </>
        }
    }

    const FilterHeader = ({name}:FilterProps) => {
        return (
            <Typography 
                component='div'
                sx={{ 
                    textAlign:'left',
                    marginLeft: 1,
                    color: 'black'
                }}
            > 
                <Box paddingTop={1}>                    
                    <HeaderDesc name={name}/>
                </Box>
            </Typography>
        )
    }

    const FilterSubGraph = ({name} : FilterProps) => {
        switch(name) {
            case 'gene-organ':
            case 'gene-disease':
            case 'gene-disease-subtype':
                return (<>
                    <Typography 
                        component='div'
                        sx={{
                            textAlign:'left',
                            marginLeft: 1,
                            color: 'black'
                        }}
                    > 
                        <Box paddingTop={2}>                    
                            Choose what associations you want to see.
                        </Box>
                    </Typography>
                    <CustomSelect 
                        options={[
                            {key:'1', value: getSubGraphDesc('gene-organ')},
                            {key:'2', value: getSubGraphDesc('gene-disease')},
                            {key:'3', value: getSubGraphDesc('gene-disease-subtype')}
                        ]}
                        label='Graph' 
                        defaultSelected={getSubGraphDesc(name)}
                        onChange={handleGraphChange}
                    />
                </>)
            case 'syndrome-disease': 
            case 'syndrome-gene-disease': 
                return (<>
                    <Typography 
                        sx={{
                            textAlign:'left',
                            marginLeft: 1,
                            color: 'black'
                        }}
                    > 
                        <Box paddingTop={2}>                    
                            Choose what associations you want to see.
                        </Box>
                    </Typography>
                    <CustomSelect 
                        options={[
                            {key:'1', value: getSubGraphDesc('syndrome-disease')},
                            {key:'2', value: getSubGraphDesc('syndrome-gene-disease')}
                        ]}
                        label='Graph' 
                        defaultSelected={getSubGraphDesc(name)}
                        onChange={handleGraphChange}
                    />

                    </>)
        }
        return (<></>)
    }
    const GraphDesc = ({name}: FilterProps) => {
        switch(name) {
            case 'gene-organ':
            case 'gene-disease':
            case 'gene-disease-subtype':
                return (<>
                    To limit the graph to one or just a few [<span style={{color: 'blue'}}>genes</span>], select as many [<span style={{color: 'blue'}}>genes</span>] as you wish compare.
                </>)
            case 'organ': 
                return (<>
                    To limit the graph to one or just a few [<span style={{color: 'red'}}>organs</span>], select as many [<span style={{color: 'red'}}>organs</span>] as you wish compare.
                </>)
            case 'disease': 
                return (<>
                    To limit the graph to one or just a few [<span style={{color: graphScheme.diseaseNode}}>organs</span>], select as many [<span style={{color: 'red'}}>organs</span>] as you wish compare.
                </>)
            case 'syndrome-disease':
            case 'syndrome-gene-disease':
                return (<>
                    To limit the graph to one or just a few [<span style={{color: graphScheme.syndromeNode}}>Syndromes</span>], select as many [<span style={{color: graphScheme.syndromeNode}}>syndromes</span>] as you wish compare.
                </>)
            default : 
            return (<>Not Implemented</>)
        }
    }

    const FilterGraph = ({name} : FilterProps) => {
        let el : React.ReactElement;
        el = <><Typography 
            component='div'
            sx={{
                textAlign:'left',
                marginLeft: 1,
                color: 'black'
            }}
        > 
            <Box paddingTop={2}>                    
                <GraphDesc name={name}/>
            </Box>
        </Typography>
        <Dropdown 
            label={getGraphDesc(name)}
            options={data}
            selected={getOnHandleChange(name).selected}
            onChange={getOnHandleChange(name).handleChange}
        />
        </>
        return el
    }

    const FilterAssociation = ({name}:FilterProps) => {
        return (<> 
            <Typography 
                component='div'
                sx={{
                    textAlign:'left',
                    marginLeft: 1,
                    color: 'black'
                }}
            > 
                <Box paddingTop={5}>                    
                    To see only confirmed associations, select CONFIRMED. 
                    To see unconfirmed select associations, select MAYBE.
                </Box>
            </Typography>
            <CustomSelect 
                options={[
                    {key:'1', value: 'Confirmed'},
                    {key:'9', value: 'Maybe'}
                ]}
                label='Associations' 
                defaultSelected={finalVerdict}
                onChange={handleFinalVerdictChange}
            />
        </>)
    }

    return (
        <Box 
            id='filter-box'
            display='flex'
            flex={1}
            flexDirection='column'
            height='80%'
            marginTop={1}
            width={350}
            // style={{background: 'black'}}
            
        >
            <Box height='100%'>
                <FilterHeader name={name}/>
                <FilterSubGraph name={name}/>
                <FilterGraph name={name}/>
            </Box>
            <Box 
                height={100}>
                <FilterAssociation name={name}/>
            </Box>
        </Box>
    )

}
