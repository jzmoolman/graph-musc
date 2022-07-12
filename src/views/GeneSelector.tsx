
import { useState, useEffect } from 'react'
import { useReadCypher  } from "use-neo4j";
import { Dropdown, DropdownProps } from 'semantic-ui-react'

export type GeneDataType = {
    value: string
    text: string
}
    

type GeneSelectorProps = {
    onChange: (genes: GeneDataType[]) => void 
}

export const GeneSelector = ({onChange}: GeneSelectorProps )  => {
    

    const onChangeDropDown = (data: DropdownProps) =>  {
        console.log('enter - onChange.Dropdown ')
        const selectedGenes = (data.value as string[]).map(value => { return {text: value ,value: value} })
        onChange(selectedGenes)
        console.log('exit - onChnage.Dropdown')        
    }

    console.log('enter -  GeneSelector')
    const { loading, error, records} = useReadCypher(
            `MATCH (g:MGene) RETURN DISTINCT g.name as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading genes - GeneSelector')
        return ( <Dropdown placeholder='Loading genes'  /> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown placeholder='Error loading genes'  /> )
    }

    const genes = records?.map( row => {
        return  {value: row.get('name'), text: row.get('name')}
    })
    console.log('exit - GeneSelector')

    return (
        <div>
            <Dropdown placeholder='Select genes' options={genes} 
                multiple={true} 
                onChange={ (e,data)=>{ onChangeDropDown(data) } }
            />
       </div>
    )
}