
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
            return 'Filter Gene'
        else if (name === 'organ') 
            return 'Filter Organ'
        else if (name === 'disease')
            return 'Filter disease'
        else if (name === 'syndrome')
            return 'Filter syndrome'
        else return 'Filter nor defined'
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


