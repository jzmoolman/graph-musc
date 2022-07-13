import { useContext, useState, useRef, MutableRefObject } from 'react'

import ForceGraph2D, { ForceGraphMethods }  from 'react-force-graph-2d'
import { Checkbox, CheckboxProps,Dropdown, DropdownProps } from 'semantic-ui-react'
import { Neo4jContext } from 'use-neo4j'


type DataType = {
    nodes: []
    linkgs: []
}

export const GeneGraph = () => {

    console.log('Enter - GeneGraph')
  
 
    const context = useContext(Neo4jContext), driver = context.driver

    const [finalVerdict, setFinalVerdict] = useState(true)
    const [filter, setFilter] = useState('')

    type dataType = 
    {   nodes: {name:string, nodeColor:string}[] 
        links: {source: string, target: string}[]
    }
    const [data, setData] =  useState<dataType>( {nodes: [], links: []} )
    
    async function finalVerdictHandler(data: CheckboxProps) {
        console.log('Enter - finalVerdictHandelder')
        console.log(data.value)
        if ( !data ) {
            console.log('Data not correct type')
            return 
        }

        const localFinalVerdict : boolean  = data.checked ? data.checked : false
        console.log('data', data, localFinalVerdict)
        loadGraph(filter, localFinalVerdict)
        setFinalVerdict(localFinalVerdict)
        console.log('Exit - finalVerdictHandelder')        
    }

    async function dropdownHandler(data: DropdownProps) {
        console.log('Enter - dropDownHandler')
        console.log(data.value)
        if ( !data ) {
            console.log('Data not correct type')
            return 
        }
        let localFilter: string = '';
        (data.value  as string[]).forEach(value => { 
            if (localFilter == '') localFilter = '['
            localFilter = localFilter + '\'' + value + '\','
        } )
        if (localFilter != '') {
            localFilter = localFilter.slice(0, localFilter.length - 1);
            localFilter = localFilter + ']'
        }
        console.log('localFilter =', localFilter, 'filter = ', filter)   
        loadGraph(localFilter,finalVerdict)
        setFilter(localFilter)
        console.log('Exit - dropDownHandler')        
    }

    async function loadGraph(filter: string, finalVerdict: boolean = true) {
        console.log('Enter - loadData')
        if (driver == null) {
            console.log('Driver not loaded')
            return 
        }

        let queryG = 'MATCH (g:MGene) RETURN DISTINCT g.name as name'
        let queryO = `MATCH (g:MGene)--(o:Organ) RETURN DISTINCT o.name as name`
        let queryR = 'MATCH (g:MGene)-[r]->(o:Organ) RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname'

        if (finalVerdict) {
     
            queryG = 'MATCH (g:MGene) WHERE g.FinalVerdict = 1 RETURN DISTINCT g.name as name'
            queryO = `MATCH (g:MGene)--(o:Organ) WHERE g.FinalVerdict = 1 RETURN DISTINCT o.name as name`
            queryR = 'MATCH (g:MGene)-[r]->(o:Organ) WHERE g.FinalVerdict = 1 RETURN ID(g) as sid, ID(o) as tid, g.name as sname, o.name as tname'

        }

        if ( filter !== '' ) {

            queryG = `MATCH (g:MGene) WHERE g.name IN ${filter} RETURN DISTINCT g.name as name`
            queryO = `MATCH (g:MGene)--(o:Organ) WHERE g.name IN ${filter} RETURN DISTINCT o.name as name`
            queryR = `MATCH (g:MGene)-[r]->(o:Organ) WHERE g.name IN ${filter} RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname`

            if (finalVerdict) {

                queryG = `MATCH (g:MGene) WHERE g.name IN ${filter} AND g.FinalVerdict = 1 RETURN DISTINCT g.name as name`
                queryO = `MATCH (g:MGene)--(o:Organ) WHERE g.name IN ${filter}  AND g.FinalVerdict = 1 RETURN DISTINCT o.name as name`
                queryR = `MATCH (g:MGene)-[r]->(o:Organ) WHERE g.name IN ${filter} AND g.FinalVerdict = 1 RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname`

            }
            
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
    

    const [genes, setGenes] = useState<GeneOptionType[]>([])

    let count = 0
    
    const loadGenes = async () => {  
        console.log('Enter - loadGenes', count++)
        if (driver == null) return 

 
        let session = driver.session()

        let res = await session.run(`MATCH (g:MGene) RETURN DISTINCT g.name as name ORDER BY name`)
       

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
        console.log('Exit - loadGenes')
    }

    console.log(genes.length)
    if (genes.length == 0 ) { 
        loadGenes() 
    }

    
    interface NodeObject {
        name: string
    }
    
    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      

    // const forceRef = useRef()      

    console.log('Exit - GeneGraph')
    const [initialCenter, setInitialCenter] = useState(true);


    return ( 
        <div>
            <div>
                <Dropdown placeholder='Select genes' options={genes} multiple={true} onChange={ (e,data)=>{ console.log(data); dropdownHandler(data) } }></Dropdown>
                <Dropdown placeholder='Select gender' options={[{text:'Both',value:'Both'},{text:'Male',value:'Male'},{text:'Female',value:'Female'}]} 
                    selected='true'></Dropdown>
                <span>  </span>
                <Checkbox label='Verified' defaultChecked={true} onChange={(e,data)=> { console.log( e); finalVerdictHandler(data)} } />
            </div>
            
            <div style={{ marginTop:"20px", border: "1px solid gray",}}>
                <ForceGraph2D 
                    width={window.innerWidth || 1000}
                    height={800}
                    ref={forceRef}
                    cooldownTicks={50}
                    
                    onEngineStop={ () => {
                        console.log('onEngineStop')
                        if (initialCenter) {
                          if ( forceRef.current ) forceRef.current.zoomToFit()
                        }
                        setInitialCenter(false)
                    }}

                    graphData={data} 
                    nodeId='name'  
                    backgroundColor='grey' 
                    linkDirectionalArrowRelPos={1} 
                    linkDirectionalArrowLength={2} 
                    nodeColor='nodeColor' 
                    nodeLabel='name' 
                    nodeCanvasObjectMode={() => 'after'} 
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        
                        const label = (node as NodeObject).name
                        const fontSize = 14 /globalScale * 1.2
                    
                        ctx.font = `${fontSize}px Sans-Serif`
                        
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle'
                        ctx.fillStyle = 'white'
                        const _x = node.x ? node.x : 0
                        const _y = node.y ? node.y : 0
                        ctx.fillText(label, _x, _y  )
                    }}
                    />
                
            </div>       

        </div>
    
    )

}
