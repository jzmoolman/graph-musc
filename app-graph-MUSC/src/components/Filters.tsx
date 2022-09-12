import React, { useContext, useEffect, useState } from 'react'
import  { Box, Divider, Typography } from '@mui/material'
import { CustomSelect } from './CustomSelect'
import { GraphName } from '../tools/graphtools'
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
            case 'gene-organ': 
            case 'gene-disease': 
            case 'gene-disease-subtype':  {
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
        console.log('handlegraphChange', name, getGraphName(name))
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

    const DisplayPanel = () => {

        type FilterProps = {
            name: GraphName
        }

        const FilterHeader = ({name}:FilterProps) => {
            switch(name) {
                case 'gene-organ':
                    {
                        return (
                            <div>
                                This graph shows all [<span style={{color: 'blue'}}>gene</span>]-[<span style={{color: 'red'}}>organ</span>] associations.
                                <div>
                                To limit the graph to one or just a few [<span style={{color: 'blue'}}>genes</span>], select as many [<span style={{color: 'blue'}}>genes</span>] from the pulldown as you wish to compare.
                                </div>
                            </div>
                        )
                    }
                case 'gene-disease':
                    {
                        return (
                            <div>
                                This graph shows all [<span style={{color: 'blue'}}>gene</span>]-[<span style={{color: 'purple'}}>disease</span>] associations.
                                <div>
                                To limit the graph to one or just a few [<span style={{color: 'blue'}}>genes</span>], select as many [<span style={{color: 'blue'}}>genes</span>] from the pulldown as you wish to compare.
                                </div>
                            </div>
                        )
                    }
                case 'gene-disease-subtype':
                {
                    return (
                        <div>
                            This graph shows all [<span style={{color: 'blue'}}>gene</span>]-[<span style={{color: 'purple'}}>disease</span>]-[<span style={{color: 'green'}}>subtype</span>] associations.
                            <div>
                                To limit the graph to one or just a few [<span style={{color: 'blue'}}>genes</span>], select as many [<span style={{color: 'blue'}}>genes</span>] from the pulldown as you wish to compare.
                            </div>
                        </div>
                    )
                }
                case 'organ': {
                    return (
                        <div>
                            This graph shows all [<span style={{color: 'red'}}>organ</span>]-[<span style={{color: 'blue'}}>gene</span>] associations.
                            <div>
                                To limit the graph to one or just a few [<span style={{color: 'red'}}>organs</span>], select as many [<span style={{color: 'red'}}>organs</span>] from the pulldown as you wish to compare.
                            </div>
                        </div>
                    )
                }
                case 'disease': {
                    return (
                        <div>
                            This graph shows all [<span style={{color: 'purple'}}>disease</span>]-[<span style={{color: 'blue'}}>gene</span>] associations.
                            <div>
                                To limit the graph to one or just a few [<span style={{color: 'purple'}}>diseases</span>], select as many [<span style={{color: 'purple'}}>diseases</span>] from the pulldown as you wish to compare.
                            </div>
                        </div>
                    )
                }
                case 'syndrome-disease': {
                    return (
                        <div>
                            This graph shows all [<span style={{color: '#DE970B'}}>syndrome</span>]-[<span style={{color: 'purple'}}>disease</span>] associations.
                            <div>
                                Choose whether you want to see <span style={{color: '#DE970B'}}>Syndrome</span>-<span style={{color: 'purple'}}>Disease</span> or <span style={{color: '#DE970B'}}>Syndrome</span>-<span style={{color: 'blue'}}>Gene</span>-<span style={{color: 'purple'}}>Disease</span> from the [<span style={{color: '#DE970B'}}>Syndrome</span>] pulldown
                            </div>
                        </div>
                    )
                }
                case 'syndrome-gene-disease': {
                    return (
                    <div>
                        This graph shows all [<span style={{color: '#DE970B'}}>syndrome</span>]-[<span style={{color: 'blue'}}>gene</span>]-[<span style={{color: 'purple'}}>disease</span>] associations.
                        <div>
                            Choose whether you want to see <span style={{color: '#DE970B'}}>Syndrome</span>-<span style={{color: 'purple'}}>Disease</span> or <span style={{color: '#DE970B'}}>Syndrome</span>-<span style={{color: 'blue'}}>Gene</span>-<span style={{color: 'purple'}}>Disease</span> from the [<span style={{color: '#DE970B'}}>Syndrome</span>] pulldown
                        </div>
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
                case 'gene-organ':
                case 'gene-disease':
                case 'gene-disease-subtype':
                    return (<>
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
                case 'syndrome-disease': {
                    return (<>
                        <CustomSelect 
                            options={[
                                {key:'1', value: getSubGraphDesc('syndrome-disease')},
                                {key:'2', value: getSubGraphDesc('syndrome-gene-disease')}
                            ]}
                            label='Graph' 
                            defaultSelected={getSubGraphDesc(name)}
                            onChange={handleGraphChange}
                        />

                    <Typography 
                        component='div'
                        sx={{
                            textAlign:'left',
                            marginLeft: 1,
                            color: 'black'
                        }}
                    >
                    <div>
                    Then, to limit the graph to one or just a few [<span style={{color: '#DE970B'}}>syndromes</span>], select as many [<span style={{color: '#DE970B'}}>syndromes</span>] from the [<span style={{color: '#DE970B'}}>Syndrome</span>] pulldown as you wish to compare.
                    </div>
                    </Typography>
                     </>)
                }
                
                case 'syndrome-gene-disease': {
                    return (<>
                        <CustomSelect 
                            options={[
                                {key:'1', value: getSubGraphDesc('syndrome-disease')},
                                {key:'2', value: getSubGraphDesc('syndrome-gene-disease')}
                            ]}
                            label='Graph' 
                            defaultSelected={getSubGraphDesc(name)}
                            onChange={handleGraphChange}
                        />

                    <Typography 
                        component='div'
                        sx={{
                            textAlign:'left',
                            marginLeft: 1,
                            color: 'black'
                        }}
                    >
                    <div>
                    Then, to limit the graph to one or just a few [<span style={{color: '#DE970B'}}>syndromes</span>], select as many [<span style={{color: '#DE970B'}}>syndromes</span>] from the [<span style={{color: '#DE970B'}}>Syndrome</span>] pulldown as you wish to compare.
                    </div>
                    </Typography>
                     </>)
                }
                defualt: {
                    return (<></>)
                }
            }
            return (<></>)
        }

        const FilterAssociation = ({name}:FilterProps) => {
            switch(name) {
                case 'gene-organ':
                    {
                        return (
                            <div>
                                To see only confirmed <span style={{color: 'blue'}}>gene</span>-<span style={{color: 'red'}}>organ</span> associations, select CONFIRMED. 
                                <div>
                                To see unconfirmed <span style={{color: 'blue'}}>gene</span>-<span style={{color: 'red'}}>organ</span> associations, select MAYBE
                                </div>
                            </div>
                        )
                    }
                case 'gene-disease':
                    {
                        return (
                            <div>
                                To see only confirmed <span style={{color: 'blue'}}>gene</span>-<span style={{color: 'purple'}}>disease</span> associations, select CONFIRMED. 
                                <div>
                                To see unconfirmed <span style={{color: 'blue'}}>gene</span>-<span style={{color: 'purple'}}>disease</span> associations, select MAYBE
                                </div>
                            </div>
                        )
                    }
                case 'gene-disease-subtype':
                {
                    return (
                        <div>
                        To see only confirmed <span style={{color: 'blue'}}>gene</span>-<span style={{color: 'purple'}}>disease</span>-<span style={{color: 'green'}}>subtype</span> associations, select CONFIRMED. 
                        <div>
                        To see unconfirmed <span style={{color: 'blue'}}>gene</span>-<span style={{color: 'purple'}}>disease</span>-<span style={{color: 'green'}}>subtype</span> associations, select MAYBE
                        </div>
                    </div>
                    )
                }
                case 'organ': {
                    return (
                        <div>
                        To see only confirmed <span style={{color: 'red'}}>organ</span>-<span style={{color: 'blue'}}>gene</span> associations, select CONFIRMED. 
                        <div>
                        To see unconfirmed <span style={{color: 'red'}}>organ</span>-<span style={{color: 'blue'}}>gene</span> associations, select MAYBE
                        </div>
                    </div>
                    )
                }
                case 'disease': {
                    return (
                        <div>
                        To see only confirmed <span style={{color: 'purple'}}>disease</span>-<span style={{color: 'blue'}}>gene</span> associations, select CONFIRMED. 
                        <div>
                        To see unconfirmed <span style={{color: 'purple'}}>disease</span>-<span style={{color: 'blue'}}>gene</span> associations, select MAYBE
                        </div>
                    </div>
                    )
                }
                case 'syndrome-disease': {
                    return (
                        <div>
                        To see only confirmed <span style={{color: '#DE970B'}}>syndrome</span>-<span style={{color: 'purple'}}>disease</span> associations, select CONFIRMED. 
                        <div>
                        To see unconfirmed <span style={{color: '#DE970B'}}>syndrome</span>-<span style={{color: 'purple'}}>disease</span> associations, select MAYBE
                        </div>
                    </div>
                    )
                }
                case 'syndrome-gene-disease': {
                    return (
                        <div>
                        To see only confirmed <span style={{color: '#DE970B'}}>syndrome</span>-<span style={{color: 'blue'}}>gene</span>-<span style={{color: 'purple'}}>disease</span> associations, select CONFIRMED. 
                        <div>
                        To see unconfirmed <span style={{color: '#DE970B'}}>syndrome</span>-<span style={{color: 'blue'}}>gene</span>-<span style={{color: 'purple'}}>disease</span> associations, select MAYBE
                        </div>
                    </div>

                    )
                }
                defualt:{
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

                    <Typography 
                        component='div'
                        sx={{
                            textAlign:'left',
                            marginLeft: 1,
                            color: 'black'
                        }}
                    >
                    <FilterAssociation name={name}/>
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
