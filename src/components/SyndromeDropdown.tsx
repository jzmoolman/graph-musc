import React from 'react'
import { useReadCypher  } from "use-neo4j";
import { Dropdown } from './Dropdown'

type SyndromeDropdownProps = {
    selected : string[]
    onChange?: (selection: string[]) => void 
}

export const SyndromeDropdown = ( {selected, onChange }: SyndromeDropdownProps) => {
    const handleChange = (selection: string[] ) =>  {
        if (onChange) {
           onChange(selection)
        }
    }

    const { loading, error, records} = useReadCypher(
            `MATCH (s:Syndrome) RETURN DISTINCT s.name as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading synrome')
        return ( <Dropdown label='Loading syndrome' options={[]} selected={[]}/> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown label='Error loading syndrome' options={[]} selected={[]}/> )
    }
    
    let genes : string[] = []

     records?.forEach(element => {
        genes.push(element.get('name') as string)
    })

    return (
        <Dropdown label='Syndrome' options={genes} onChange={handleChange} selected={selected}/>
    )
}


