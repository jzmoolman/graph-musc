import React from 'react'
import { useReadCypher  } from "use-neo4j";
import { Dropdown } from './Dropdown'

type GeneDropdownProps = {
    onChange?: (selection: string[]) => void 
}

export const GeneDropdown = ( {onChange }: GeneDropdownProps) => {

    const handleChange = (selection: string[] ) =>  {
        if (onChange) {
           onChange(selection)
        }
    }

    const { loading, error, records} = useReadCypher(
            `MATCH (g:MGene) RETURN DISTINCT g.name as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading genes - GeneSelector')
        return ( <Dropdown label='Loading genes' options={[]}/> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown label='Error loading genes' options={[]}/> )
    }
    
    let genes : string[] = []

     records?.forEach(element => {
        genes.push(element.get('name') as string)
    })

    return (
        <Dropdown label='Genes' options={genes} onChange={handleChange}/>
    )
}


