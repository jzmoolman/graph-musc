import React, { useContext, useEffect, useState } from 'react'
import  { Box, Divider, Typography } from '@mui/material'
import { CustomSelect } from './CustomSelect'
import { GraphName } from '../tools/graphtools'
import { Dropdown } from './Dropdown'
import { Neo4jContext } from 'use-neo4j'
import { loadGene, loadOrgan, loadDisease, loadSyndrome } from '../tools/graphdata'

const getGraphName = (name: string): GraphName => {
    if (name === 'Disease') { 
        return 'syndrome-disease'
    } else if (name === 'Gene->Disease') {
        return 'syndrome-gene-disease'
    } else {
        return 'syndrome-disease'
    }
}

const getGraphDesc = (name: GraphName) => {
    switch (name) {
    case 'gene': 
      return 'Gene'
    case 'organ':
        return 'Organ'
    case 'disease':
        return 'Disease'
    case 'syndrome-disease':
        return 'Syndrome'
    case 'syndrome-gene-disease':
        return 'Syndrome'
    default:
        return 'Unknown'
    }
}
const getSubGraphDesc = (name: GraphName) => {
    switch (name) {
    case 'syndrome-disease':
        return 'Disease'
    case 'syndrome-gene-disease':
        return 'Gene->Disease'
    default:
        return 'Disease'
    }
}

type FiltersProps = {
    name: GraphName
    genes: string[]
    organs: string[]
    diseases: string[]
    syndromes: string[]
    finalVerdict: string
    onGraphChange?: (name: GraphName) => void
    onGeneChange?: (selcetd: string[]) => void
    onOrganChange?: (selcetd: string[]) => void
    onDiseaseChange?: (selected: string[]) => void
    onSyndromeChange?: (selected: string[]) => void
    onFinalVerdictChange?: (verdicts: string) => void
}

export const Filters = ({
        name, 
        genes,
        organs,
        diseases, 
        syndromes, 
        finalVerdict,
        onGraphChange,
        onGeneChange,
        onOrganChange,
        onDiseaseChange,
        onSyndromeChange,
        onFinalVerdictChange
} : FiltersProps ) => {
    console.log('enter - Filters', name)

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<string[]>([])

    useEffect(()=> {
        console.log('useEffect', name)
        switch (name) { 
            case 'gene': {
                loadGene(driver, handleData)
                break;
            }
            case 'organ': {
                loadOrgan(driver, handleData)
                break;
            }
            case 'disease': {
                loadDisease(driver, handleData)
                break;
            }
            case 'syndrome-disease':
            case 'syndrome-gene-disease': {
                loadSyndrome(driver, handleData)
            }
        }
        console.log('loading data')
    },[])

    const handleData = (data: string[]) => {
        console.log('enter - handleData')
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
            case 'gene':
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

    const DisplayPanel = () => {

        type FilterProps = {
            name: GraphName
        }

        const FilterHeader = ({name}:FilterProps) => {
            switch(name) {
                case 'gene': {
                    return (
                        <div>
                            Select as many <span style={{color: 'blue'}}>Genes</span> as you wish to see
                        </div>
                    )
                }
                case 'organ': {
                    return (
                        <div>
                            Select as many <span style={{color: 'red'}}>Organs</span> as you wish to see
                        </div>
                    )
                }
                case 'disease': {
                    return (
                        <div>
                            Select as many <span style={{color: 'purple'}}>Diseases</span> as you wish to see
                        </div>
                    )
                }
                case 'syndrome-disease': 
                case 'syndrome-gene-disease': {
                    return (
                        <div>
                            Select a syndrome graph and as many <span style={{color: 'yellow' , backgroundColor:'black'}}>Syndromes</span> as you wish to see
                        </div>
                    )
                }
                defualt:{
                    return (
                        <div>
                           Select as many <span style={{color: 'red'}}>{name}</span> as you wish to see
                        </div>
                    )
                      
                }
            }
            return (
                <div>
                    Select as many <span style={{color: 'red'}}>{name}</span> as you wish to see
                </div>
            )
        }

        const FilterGraph = ({name} : FilterProps) => {
            switch(name) {
                case 'syndrome-disease': 
                case 'syndrome-gene-disease': {
                    return (<>
                        <CustomSelect 
                            options={[
                                {key:'1', value: getSubGraphDesc('syndrome-disease')},
                                {key:'2', value: getSubGraphDesc('syndrome-gene-disease')}
                            ]}
                            label='Syndrome Graph' 
                            defaultSelected={getSubGraphDesc(name)}
                            onChange={handleGraphChange}
                        />
                    </>)
                }
                defualt: {
                    return (<></>)
                }
            }
            return (<></>)
        }

        return (
            <> 
                <Box
                    display='flex'
                    flex={1}
                    flexDirection='column'
                    sx={{
                        color: 'grey',
                    }}
                >
                    <Typography 
                        component='div'
                        sx={{
                            textAlign:'left',
                            marginLeft: 1,
                            color: 'black'
                        }}
                    >
                        <FilterHeader name={name}/>
                    </Typography>
                    <FilterGraph name={name}/> 
                    <Dropdown 
                        label={getGraphDesc(name)}
                        options={data}
                        selected={getOnHandleChange(name).selected}
                        onChange={getOnHandleChange(name).handleChange}
                    />
                    <CustomSelect 
                            options={[
                                {key:'1', value: 'Confirmed'},
                                {key:'9', value: 'Maybe'}
                            ]}
                            label='Associations' 
                            defaultSelected={finalVerdict}
                            onChange={handleFinalVerdictChange}
                    />
                </Box>

            </>
        )     
    }

    return (
        <Box 
            id='filter-box'
            display='flex'
            flex={1}
            flexDirection='column'
        >
            <DisplayPanel />
        </Box>
    )

}
