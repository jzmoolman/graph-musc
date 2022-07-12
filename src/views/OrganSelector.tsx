import { useState, useEffect } from 'react'
import { useReadCypher  } from "use-neo4j";
import { Dropdown, DropdownProps } from 'semantic-ui-react'

export type OrganDataType = {
    value: string
    text: string
}

type OrganSelectorProps = {
    onChange: (genes: OrganDataType[]) => void 
}

export const OrganSelector = ({onChange}: OrganSelectorProps )  => {
    
    console.log('enter - OrganSelector')

    const onChangeDropDown = (data: DropdownProps) =>  {
        console.log('enter - onChange.Dropdown ')
        const selectedOrgan = (data.value as string[]).map(value => { return {text: value ,value: value} })
        onChange(selectedOrgan)
        console.log('exit - onChange.Dropdown')        
    }

    const { loading, error, records} = useReadCypher(
            `MATCH (o:Organ) RETURN DISTINCT o.name as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading organ')
        return ( <Dropdown placeholder='Loading orgran'  /> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown placeholder='Error loading genes'  /> )
    }

    const organs = records?.map( row => {
        return  {value: row.get('name'), text: row.get('name')}
    })
    console.log('exit - Orgran')

    return (
        <div>
            <Dropdown placeholder='Select organ' options={organs} 
                multiple={true} 
                onChange={ (e,data)=>{ onChangeDropDown(data) } }
            />
       </div>
    )
}