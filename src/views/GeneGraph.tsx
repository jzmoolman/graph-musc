import { useContext, useState } from 'react'

import ForceGraph2D  from 'react-force-graph-2d'
import { DropdownProps } from 'semantic-ui-react'
import { Neo4jContext } from 'use-neo4j'
import {Dropdown} from 'semantic-ui-react'


type DataType = {
    nodes: []
    linkgs: []
}

export const GeneGraph = () => {

    console.log('Enter GeneGraph')
    console.log('===============')
 
    const context = useContext(Neo4jContext), driver = context.driver


    type dataType = 
    {   nodes: {name:string, nodeColor:string}[] 
        links: {source: string, target: string}[]
    }
    const [data, setData] =  useState<dataType>( {nodes: [], links: []} )
    
    async function dropdownHandler(data: DropdownProps) {
        console.log('Enter - Dropdown on change')
        console.log(data.value)
        if (driver == null) {
            console.log('Driver not loaded')
            return 
        }
        if ( !data ) {
            console.log('Data not correct type')
            return 
        }
    
        let filter = '';
        (data.value  as string[]).forEach(value => { 
            if (filter == '') filter = '['
            filter = filter + '\'' + value + '\','
        } )
        if (filter != '') {
            filter = filter.slice(0, filter.length - 1);
            filter = filter + ']'
        }

        let queryG = 'MATCH (g:MGene) RETURN ID(g) as id, g.name as name'
        let queryO = 'MATCH (o:Organ) RETURN ID(o) as id, o.name as name'
        let queryR =  'MATCH (g:MGene)-[r]->(o:Organ) RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname'

        if ( filter !== '' ) {

            queryG = `MATCH (g:MGene) WHERE g.name IN ${filter} RETURN ID(g) as id, g.name as name`
            queryO = `MATCH (g:MGene)--(o:Organ) WHERE g.name IN ${filter} RETURN DISTINCT o.name as name`
            queryR = `MATCH (g:MGene)-[r]->(o:Organ) WHERE g.name IN ${filter} RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname`
            
        }
        console.log(queryG)
        console.log(queryO)
        console.log(queryR)
        let session = driver.session()

        let res = await session.run(queryG)
        try {
    
            let nodes = res.records.map( row => {return { name: row.get('name'), nodeColor:'blue'} })
            console.log('Data loaded - Gene')
    
            res = await session.run(queryO)
            nodes = Array.prototype.concat(nodes, res.records.map( row => {return { name: row.get('name'), nodeColor:'red'} }))
            console.log('Data loaded - Organ')

            res = await session.run(queryR)
            let links = res.records.map( row => {return { source: row.get('sname'), target: row.get('tname') } })
            console.log('Data loaded - Relationship')
            
            console.log('Data loaded')
            session.close();
            setData({ nodes, links })
        } catch (e) {
            throw e
        }
        finally {
            await session.close()
        
        }
      
    }

    type GeneOptionType = {
        value: string
        text: string
    }
    const [genes, setGenes] = useState<GeneOptionType[]>([{value: '',text:''}])

    const loadGenes = async () => {
        
        
        console.log('Enter - Load Gene data')
        
        if (driver == null) return 
        let session = driver.session()

        let res = await session.run(`MATCH (g:MGene) RETURN g.name as name`)
       

        let elems = [{value: '',text:''}]
        if (res.records) { 
            elems = res.records.map( row => {
                const tmp = { 
                value: row.get('name') as string,
                text: row.get('name') as string 
                }
                
            return tmp
            })
        }
        
        setGenes(elems)
        console.log('Exit - Load Gene data')
    }

    if (genes.length < 2 )  loadGenes() 

            
    return ( 
        <div>
            <div>
                <Dropdown placeholder='select genes' options={genes} multiple={true} onChange={ (e,data)=>{ console.log(data); dropdownHandler(data) } }></Dropdown>
                <span> </span>
            </div>
           
            <ForceGraph2D graphData={data} nodeId='name' width={800} height={800} backgroundColor='grey' 
               linkDirectionalArrowRelPos={1} linkDirectionalArrowLength={2} nodeColor='nodeColor' nodeLabel='name'/>       
        </div>
    
    )

}
