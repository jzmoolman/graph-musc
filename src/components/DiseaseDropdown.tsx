import React from 'react'
import { useReadCypher  } from "use-neo4j";
import { Dropdown } from './Dropdown'

type DiseaseDropdownProps = {
    selected: string[]
    onChange?: (selection: string[]) => void 
}

export const DiseaseDropdown = ( {selected, onChange }: DiseaseDropdownProps) => {
    // console.log('enter = DiseaseDropdown')
    // console.log('selected', selected)

    const handleChange = (selection: string[] ) =>  {
        if (onChange) {
           onChange(selection)
        }
    }

    const { loading, error, records} = useReadCypher(
            `MATCH (d:Disease) RETURN DISTINCT d.name as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading disease')
        return ( <Dropdown label='Loading disease' options={[]} selected={[]}/> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown label='Error loading diseas' options={[]} selected={[]}/> )
    }
    
    let diseases : string[] = []

     records?.forEach(element => {
        diseases.push(element.get('name') as string)
    })

    return (
        <Dropdown label='Diseases' options={diseases} onChange={handleChange} selected={selected}/>
    )
}


