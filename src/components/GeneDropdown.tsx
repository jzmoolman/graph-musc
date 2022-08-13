import React, { useContext, useEffect, useState } from 'react'
import { Neo4jContext } from 'use-neo4j'
import { loadGene } from '../tools/graphdata'
import { Dropdown } from './Dropdown'

type GeneDropdownProps = {
    selected: string[]
    onChange?: (selected: string[]) => void 
}

export const GeneDropdown = ( {selected, onChange }: GeneDropdownProps) => {
    
    const context = useContext(Neo4jContext), driver = context.driver
    const [genes, setGenes] = useState<string[]>([])

    const handleData = (data: string[]) => {
        setGenes(data)
    }

    useEffect(()=> {
        loadGene(driver, handleData)
        console.log('loading genes - the new way')
    },[])

    const handleChange = (selection: string[] ) =>  {
        if (onChange) {
           onChange(selection)
        }
    }

    return (
        <Dropdown 
            label='Filter Genes' 
            options={genes} 
            selected={selected}
            onChange={handleChange}
        />
    )
}


