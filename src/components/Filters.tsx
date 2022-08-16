import React, { useState } from 'react'
import  { Box, Divider, Typography } from '@mui/material'
import { CustomSelect } from './CustomSelect'
import { CustomDropdown } from './CustomDropdown'
import { GraphName } from '../tools/graphtools'

type FiltersProps = {
    name: GraphName
    genes: string[]
    organs: string[]
    diseases: string[]
    syndromes: string[]
    finalVerdict: string
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
        onGeneChange,
        onOrganChange,
        onDiseaseChange,
        onSyndromeChange,
        onFinalVerdictChange
} : FiltersProps ) => {

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

    const DisplayPanel = () => {
        let __handleChange:  (data: string[])=>void
        let __selected: string[]
        if (name === 'gene' )  {
            __handleChange = handleGeneChange
            __selected = genes
        } else if (name == 'organ') {
            __handleChange = handleOrganChange
            __selected = organs
        } else if (name == 'disease') {
            __handleChange =  handleDiseaseChange
            __selected = diseases
        } else if ( name == 'syndrome') {
            __handleChange =  handleSyndromeChange
            __selected = syndromes
        } else {
            __handleChange = handleGeneChange
            __selected = genes
        }

        type FilterHeaderProps = {
            name: GraphName
        }
        const FilterHeader = ({name}:FilterHeaderProps) => {
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
                case 'syndrome': {
                    return (
                        <div>
                            Select as many <span style={{color: 'yellow'}}>Syndromes</span> as you wish to see
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

                        {/* Choose from the available filters  */}
                    </Typography>
                {/* <Divider 
                    sx={{
                        marginLeft:'8px',
                        marginBottom: '8px',
                        width:'95%'}} 
                /> */}

                <CustomDropdown 
                    name={name} 
                    selected={__selected}
                    onChange={__handleChange} />
                <CustomSelect 
                        options={
                            [
                                //Do not know how to get the key value yet
                                {key:'1', value: 'Confirmed'},
                                {key:'9', value: 'Maybe'}]
                                // {key:'0', value:  'Unknown'}]
                        }
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
