
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Driver }  from  'neo4j-driver'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods }  from 'react-force-graph-2d'
import { SyndromeDataType } from './SyndromeSelector'

type SyndromeGeneOrganGraphType = {

    verified: boolean
    selectedSyndromes: SyndromeDataType[]
}

const selectedSyndromesToStr = (seletedSyndromes: SyndromeDataType[]) => {
    let localFilter = '';
    seletedSyndromes.forEach(value => { 
        if (localFilter === '') localFilter = '['
            localFilter = localFilter + '\'' + value.text + '\','
        } )
        if (localFilter !== '') {
            localFilter = localFilter.slice(0, localFilter.length - 1);
            localFilter = localFilter + ']'
        }
    return localFilter
}

type dataType = 
{   nodes: {name: string, nodeColor: string}[] 
    links: {source: string, target: string}[]
}

const  loadData = async (driver: Driver | undefined, selectedSyndromes: SyndromeDataType[], verified: boolean,
        onData:(data: dataType)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const syndromesStr = selectedSyndromesToStr(selectedSyndromes)
    console.log('selectedSyndromesStr', syndromesStr)
    let whereCLAUSE = ''
    if ( syndromesStr !== '' && verified ) {
        whereCLAUSE =  'WHERE g.SyndromeMasterName IN ' + syndromesStr + ' AND g.FinalVerdict = 1'
    } else if ( syndromesStr !== '' && !verified ) {
        whereCLAUSE =  'WHERE g.name IN ' + syndromesStr
    } else if ( syndromesStr === '' && verified ) {
        whereCLAUSE = ' WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = ''
    }

    const qSyndrome = `MATCH (g:MGene) ${whereCLAUSE} RETURN DISTINCT g.SyndromeMasterName as name`
    const qOrgan = `MATCH (g:MGene)--(o:Organ) ${whereCLAUSE} RETURN DISTINCT o.name as name`
    const qRelation = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN ID(g) as sid,ID(o) as tid, g.SyndromeMasterName as sname, o.name as tname`

    console.log('gSyndrome', qSyndrome)

    let session = driver.session()

    let res = await session.run(qSyndrome)
    try {
        let id = 0
        let nodes = res.records.map( row => { 
            return { name: row.get('name') as string, nodeColor:'blue' } 
         })
        console.log('Data loaded - Syndrome')

        res = await session.run(qOrgan)
        nodes = Array.prototype.concat(nodes, res.records.map( row => {return { name: row.get('name') as string, nodeColor:'red'} }))
        console.log('Data loaded - Organ')

        res = await session.run(qRelation)
        let links = res.records.map( row => {return { source: row.get('sname'), target: row.get('tname') } })
        console.log('Data loaded - Relationship')
        
        console.log('Data loaded')
        session.close();
        onData({ nodes, links })
    } catch (e) {
        throw e
    }
    finally {
        await session.close()
    
    }
}

export const SyndromeGraph = ( {verified, selectedSyndromes}: SyndromeGeneOrganGraphType ) => {

    console.log('enter - SyndromeGraph')
    console.log('selectedSyndromes', selectedSyndromes)
    
    const isMounted = useRef(false)
    const [rerender, setRerender] = useState(0);

    let tick = 0 
    console.log('tick', tick )

    const onResize = () => {
        console.log('onResize')
        console.log('tick', tick )
        if ( tick === 0 ) {
            tick = tick + 1
            console.log('send rerender')
            setRerender( rerender + 1 ) 
        }
    }

    useEffect(()=>{
        console.log('Graph mounted')
        isMounted.current = true
        window.addEventListener("resize", onResize )
    },[])

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<dataType>( {nodes: [], links: []} )

    useEffect( () => {
        console.log('Reload data')
        const onData = (data: dataType) =>{
            console.log(data)
            setData(data)
            
        }
        loadData(driver, selectedSyndromes, verified,  onData)

    },[selectedSyndromes, verified] )

    interface NodeObject {
        name: string
    }
    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      

    const minWidth = window.innerWidth -38 -300
    const minHeight = window.innerHeight -60

    return ( 
        <ForceGraph2D 
        ref={forceRef}
            width={minWidth}
            height={minHeight}
            graphData={data}
            backgroundColor='grey'
            nodeId='name'  
            nodeColor='nodeColor' 
            nodeLabel='name' 
            linkDirectionalArrowRelPos={1} 
            linkDirectionalArrowLength={2} 
            nodeCanvasObjectMode={() => 'after'} 
            nodeCanvasObject={(node, ctx, globalScale) => {
                
                const label = (node as NodeObject).name
                const fontSize = 8 /globalScale
            
                const _x = node.x?node.x:0
                const _y = node.y?node.y:0
                ctx.font = `${fontSize}px Sans-Serif`;
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle'
                ctx.fillStyle = 'black'
                ctx.fillText(label, _x, _y + 6)
            }}
            />
    )
}

