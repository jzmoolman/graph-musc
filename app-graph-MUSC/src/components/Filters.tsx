import React, { useContext, useEffect, useState } from 'react'
import  { Box, Typography } from '@mui/material'
import { CustomSelect } from './CustomSelect'
import { GraphName } from '../tools/graphtools'
import { Dropdown } from './Dropdown'
import { Neo4jContext } from 'use-neo4j'
import { defaultGraphSchemeV2 } from '../data/forcegraph/types.forcegraph'
import { GeneAffectOrgan, load_gene_affect_organ } from '../data/neo4j/gene-_-organ.neo4j'
import { GeneCauseDisease, load_gene_cause_disease } from '../data/neo4j/gene-cause-disease.neo4j'
import { SyndromeGeneCauseDisease, load_syndrome_gene_cause_disease } from '../data/neo4j/syndryome-gene-disease.neo4j'

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
        case 'organ-gene': return 'Organ'
        case 'disease-gene': return 'Disease'
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
    gender: string
    // graphScheme: GraphScheme
    onGraphChange?: (name: GraphName) => void
    onGeneChange?: (selcetd: string[]) => void
    onOrganChange?: (selcetd: string[]) => void
    onDiseaseChange?: (selected: string[]) => void
    onSyndromeChange?: (selected: string[]) => void
    onGenderChange?:(name: string)=> void
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
        gender,
        // graphScheme, 
        onGraphChange,
        onGeneChange,
        onOrganChange,
        onDiseaseChange,
        onSyndromeChange,
        onGenderChange,
        onFinalVerdictChange
} : FiltersProps ) => {

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] = useState<string[]>([])

    useEffect(()=> {
        console.log('---->Debug: Filters.tsx useEffect')
        switch (name) { 
            case 'gene-organ': 
            case 'gene-disease': 
            case 'gene-disease-subtype':  {
                // loadGene(driver, specialist, handleData)
                // loadGenes_hasFinalVerdict(driver,{filterGenes:genes, onData:handleData2})
                load_gene_affect_organ( driver, 
                    {   
                        specialist: specialist,
                        geneFilter: genes,
                        organFilter: organs,
                        onData:handleDataGene
                    }, )
                break;
            }
            case 'organ-gene': {
                load_gene_affect_organ( driver, 
                    {   
                        specialist: specialist,
                        geneFilter: genes,
                        organFilter: organs,
                        onData:handleDataOrgan
                    }, )
                // loadOrgan(driver, specialist, handleData)
                break;
            }
            case 'disease-gene': {
                load_gene_cause_disease(driver,                     {   
                        specialist: specialist,
                        geneFilter: genes,
                        diseaseFilter: organs,
                        onData:handleDataDisease
                    }, )
                break;
            }
            case 'syndrome-disease':
            case 'syndrome-gene-disease': {
                load_syndrome_gene_cause_disease(driver,                     {   
                        specialist: specialist,
                        geneFilter: genes,
                        diseaseFilter: organs,
                        onData:handleDataSyndrome
                    }, )
                break;
                // loadSyndrome(driver, specialist, handleData)
            }
        }
    },[])

    const handleDataGene = (data:GeneAffectOrgan[]) => { 
        let _data : string[]= []
        data.forEach( gene_affect_organ => {
            let index = _data.findIndex( s=> s===gene_affect_organ.gene.name)
            if (index === -1) {
                _data.push(gene_affect_organ.gene.name)
            }
        })
        console.log('--->Debug: count genes', _data.length)
        setData(_data.sort())
    }
    
    const handleDataOrgan = (data:GeneAffectOrgan[]) => { 
        let _data : string[]= []
        data.forEach( gene_affect_organ => {
            let index = _data.findIndex( s=> s===gene_affect_organ.organ.name)
            if (index === -1) {
                _data.push(gene_affect_organ.organ.name)
            }
        })
        console.log('--->Debug: count genes', _data.length)
        setData(_data.sort())
    }

    const handleDataDisease = (data:GeneCauseDisease[]) => { 
        let _data : string[]= []
        data.forEach( gene_cause_disease => {
            let index = _data.findIndex( s=> s===gene_cause_disease.disease.name)
            if (index === -1) {
                _data.push(gene_cause_disease.disease.name)
            }
        })
        console.log('--->Debug: count genes', _data.length)
        setData(_data.sort())
    }
    
    const handleDataSyndrome = (data:SyndromeGeneCauseDisease[]) => { 
        let _data : string[]= []
        data.forEach( gene_cause_disease => {
            let index = _data.findIndex( s=> s===gene_cause_disease.syndrome.name)
            if (index === -1) {
                _data.push(gene_cause_disease.syndrome.name)
            }
        })
        console.log('--->Debug: count genes', _data.length)
        setData(_data.sort())
    }

    const handleData = (data: string[]) => { 
         setData(data)
    }


    const build_lookup = (data:any[], value:string)=> {

        let result: string[] = []
        data.forEach(row => { 
            type ObjectKey = keyof typeof row;
            const myVar = value as ObjectKey;
            if (row.hasOwnProperty(value)) {
                result.push(row[myVar])
            }
        });
        return result
    }

    const handleGraphChange = (name: string) => {
        if (onGraphChange) { 
            onGraphChange(getGraphName(name))
        }
    }
    
    const handleGenderChange = (name: string) => {
        if (onGenderChange) { 
            onGenderChange(name)
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
            case 'organ-gene':
                return {handleChange: handleOrganChange, selected: organs}
            case 'disease-gene':
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
                    This graph shows all [<span style={{color: defaultGraphSchemeV2.gene_stroke}}>gene</span>]-[<span style={{color: defaultGraphSchemeV2.organ_stroke}}>organ</span>] associations.
                </>)
            case 'gene-disease':
                return  (<>
                    This graph shows all [<span style={{color: defaultGraphSchemeV2.gene_stroke}}>gene</span>]-[<span style={{color: defaultGraphSchemeV2.disease_stroke}}>disease</span>] associations.
                </>)
            case 'gene-disease-subtype':
                return  (<>
                    This graph shows all [<span style={{color: defaultGraphSchemeV2.gene_stroke}}>gene</span>]-[<span style={{color: defaultGraphSchemeV2.disease_stroke}}>disease</span>]-[<span style={{color: defaultGraphSchemeV2.subtype_stroke}}>subtype</span>] associations.
                </>)
            case 'organ-gene': 
                return (<>
                    This graph shows ALL [<span style={{color: defaultGraphSchemeV2.organ_stroke}}>organ</span>]-[<span style={{color: defaultGraphSchemeV2.gene_stroke}}>gene</span>] associations.
                </>)
            case 'disease-gene':
                return (<>
                    This graph shows ALL [<span style={{color: defaultGraphSchemeV2.disease_stroke}}>disease</span>]-[<span style={{color: defaultGraphSchemeV2.gene_stroke }}>gene</span>] associations.
                </>)
            case 'syndrome-disease': 
                return (<>
                    This graph shows ALL [<span style={{color: defaultGraphSchemeV2.syndrome_stroke}}>Syndrome</span>]-[<span style={{color: defaultGraphSchemeV2.disease_stroke}}>disease</span>] associations.
                </>)
            case 'syndrome-gene-disease': 
                return (<>
                    This graph shows ALL [<span style={{color: defaultGraphSchemeV2.syndrome_stroke }}>Syndrome</span>]-[<span style={{color: defaultGraphSchemeV2.gene_stroke}}>gene</span>]-[<span style={{color: defaultGraphSchemeV2.disease_stroke}}>disease</span>] associations.
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
                    To limit the graph to one or just a few [<span style={{color: defaultGraphSchemeV2.gene_stroke}}>genes</span>], select as many [<span style={{color: defaultGraphSchemeV2.gene_stroke}}>genes</span>] as you wish compare.
                </>)
            case 'organ-gene': 
                return (<>
                    To limit the graph to one or just a few [<span style={{color: defaultGraphSchemeV2.organ_stroke}}>organs</span>], select as many [<span style={{color: defaultGraphSchemeV2.organ_stroke}}>organs</span>] as you wish compare.
                </>)
            case 'disease-gene': 
                return (<>
                    To limit the graph to one or just a few [<span style={{color: defaultGraphSchemeV2.disease_stroke}}>diseases</span>], select as many [<span style={{color: defaultGraphSchemeV2.disease_stroke}}>diseases</span>] as you wish compare.
                </>)
            case 'syndrome-disease':
            case 'syndrome-gene-disease':
                return (<>
                    To limit the graph to one or just a few [<span style={{color: defaultGraphSchemeV2.syndrome_stroke}}>syndromes</span>], select as many [<span style={{color: defaultGraphSchemeV2.syndrome_stroke}}>syndromes</span>] as you wish compare.
                </>)
            default : 
            return (<>Not Implemented</>)
        }
    }

 
    const FilterGraph = ({name} : FilterProps) => {
        // console.log('---->Debug: Filters.tsx FilterGraph')
        // console.log('---->Debug: name=',name)

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
                    <GraphDesc name={name}/>
                </Box>
            </Typography>
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
                <Box paddingTop={2}>                    
                Choose how you want to filter by gender.
                </Box>
            </Typography>
            <CustomSelect 
                        options={[
                            {key:'Male', value: 'Male'},
                            {key:'Female', value: 'Female'},
                        ]}
                        label='Graph' 
                        defaultSelected={gender}
                        onChange={handleGenderChange}
                    />
        </>)
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

    return (<>
        <Box  
            id='filter-box' 
            display='grid'
            height='100%'
            gridTemplateRows='calc(100% - 175px) 175px' 
        >
            <Box 
                id='filter-box1' 
            >
                <FilterHeader name={name}/>
                <FilterSubGraph name={name}/>
                <FilterGraph name={name}/>

            </Box>
            <Box 
                id='filter-box2' 
            >
                <FilterAssociation name={name}/>
            </Box>
        </Box>
    </>)

}

