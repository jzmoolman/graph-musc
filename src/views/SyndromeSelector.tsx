import { useReadCypher  } from "use-neo4j";
import { Dropdown, DropdownProps } from 'semantic-ui-react'

export type SyndromeDataType = {
    value: string
    text: string
}
    

type SyndromeSelectorProps = {
    onChange: (genes: SyndromeDataType[]) => void 
}

export const SyndromeSelector = ({onChange}: SyndromeSelectorProps )  => {

    

    const onChangeDropDown = (data: DropdownProps) =>  {
        console.log('enter - onChange.Dropdown ')
        const selectedGenes = (data.value as string[]).map(value => { return {text: value ,value: value} })
        onChange(selectedGenes)
        console.log('exit - onChnage.Dropdown')        
    }

    console.log('enter -  SyndromeSelector')
    const { loading, error, records} = useReadCypher(
            `MATCH (g:MGene) RETURN DISTINCT g.SyndromeMasterName as name ORDER BY name`)

    if ( loading ) { 
        console.log('loading genes - SyndromeSelector')
        return ( <Dropdown placeholder='Loading Syndrome'  /> )
    }

    if ( error ) {
        console.log(error.message)
        return ( <Dropdown placeholder='Error loading Syndrome'  /> )
    }

    const genes = records?.map( row => {
        return  {value: row.get('name'), text: row.get('name')}
    })
    console.log('exit - SymdromeSelector')

    return (
        <div>
            <Dropdown placeholder='Select syndrome' options={genes} 
                multiple={true} 
                onChange={ (e,data)=>{ onChangeDropDown(data) } }
            />
       </div>
    )
}