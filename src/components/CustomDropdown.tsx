
import React, { useContext, useEffect, useState } from 'react'
import { Neo4jContext } from 'use-neo4j'
import { loadDisease, loadGene, loadOrgan, loadSyndrome } from '../tools/graphdata'
import { GraphName } from '../tools/graphtools'
import { Dropdown } from './Dropdown'

type CustomDropdownProps = {
    name: GraphName 
    selected: string[]
    onChange?: (selected: string[]) => void 
}

export const CustomDropdown = ( {name, selected, onChange }: CustomDropdownProps) => {
    
    const context = useContext(Neo4jContext), driver = context.driver

    const [data, setData] = useState<string[]>([])

    useEffect(()=> {
        if (name === 'gene') {
            loadGene(driver, handleData)
        } else if (name === 'organ') {
            loadOrgan(driver, handleData)
        } else if ( name == 'disease') {
            loadDisease(driver, handleData)
        } else if ( name == 'syndrome') {
            loadSyndrome(driver, handleData)
        }
        console.log('loading data')
    },[])

    const handleData = (data: string[]) => {
        setData(data)
    }

    const handleChange = (selection: string[] ) =>  {
        if (onChange) {
           onChange(selection)
        }
    }

    const getLabelName = (name: string) => {
        if (name === 'gene')
            return 'Choose Genes'
        else if (name === 'organ') 
            return 'Choose Organs'
        else if (name === 'disease')
            return 'Choose Diseases'
        else if (name === 'syndrome')
            return 'Choose Syndromes'
        else return 'Filter not defined'
    }

    return (
        <Dropdown 
            label={getLabelName(name)}
            options={data} 
            selected={selected}
            onChange={handleChange}
        />
    )
}


