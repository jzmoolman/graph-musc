import React from 'react'
import { useReadCypher  } from "use-neo4j";
import { Dropdown } from './Dropdown'

type OrganDropdownProps = {
    onChange?: (selection: string[]) => void 
}

export const OrganDropdown = ( {onChange }: OrganDropdownProps) => {
    const handleChange = (selection: string[] ) =>  {
        if (onChange) {
           onChange(selection)
        }
    }

    const { loading, error, records} = useReadCypher(
            `MATCH (o:Organ) RETURN DISTINCT o.name as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading organ')
        return ( <Dropdown label='Loading organ' options={[]}/> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown label='Error loading organ' options={[]}/> )
    }
    
    let genes : string[] = []

     records?.forEach(element => {
        genes.push(element.get('name') as string)
    })

    return (
        <Dropdown label='Organ' options={genes} onChange={handleChange}/>
    )
}


