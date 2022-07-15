import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Driver }  from  'neo4j-driver'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods }  from 'react-force-graph-2d'
import { GeneDataType } from './GeneSelector'
import { paintNode } from './genGraph'

type GeneOrganGraphType = {
    verified: boolean
    selectedGenes: GeneDataType[]
}

const selectedGenesToStr = (seletedGenes: GeneDataType[]) => {
    let localFilter = '';
    seletedGenes.forEach(value => { 
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

const  loadData = async (driver: Driver | undefined, selectedGenes: GeneDataType[], verified: boolean,
        onData:(data: dataType)=> void) => {
    console.log('enter - loadData')
    if (driver == null) {
        console.log('Driver not loaded')
        return 
    }

    const geneStr = selectedGenesToStr(selectedGenes)
    console.log('selectedGenderStr', geneStr)
    let whereCLAUSE = ''
    if ( geneStr !== '' && verified ) {
        whereCLAUSE =  'WHERE g.name IN ' + geneStr + ' AND g.FinalVerdict = 1'
    } else if ( geneStr !== '' && !verified ) {
        whereCLAUSE =  'WHERE g.name IN ' + geneStr
    } else if ( geneStr === '' && verified ) {
        whereCLAUSE = ' WHERE g.FinalVerdict = 1'
    } else {
        whereCLAUSE = ''
    }

    const qGene = `MATCH (g:MGene) ${whereCLAUSE} RETURN DISTINCT g.name as name`
    const qOrgan = `MATCH (g:MGene)--(o:Organ) ${whereCLAUSE} RETURN DISTINCT o.name as name`
    const qRelation = `MATCH (g:MGene)-[r]->(o:Organ) ${whereCLAUSE} RETURN ID(g) as sid,ID(o) as tid, g.name as sname, o.name as tname`

    console.log('gGene', qGene)

    let session = driver.session()

    let res = await session.run(qGene)
    try {

        let nodes = res.records.map( row => { 
            return { name: row.get('name') as string, nodeColor:'blue', fontColor:'white' }
         })
        console.log('Data loaded - Gene')

        res = await session.run(qOrgan)
        nodes = Array.prototype.concat(nodes, res.records.map( row => {return { name: row.get('name') as string, nodeColor:'red', fontColor:'black'} }))
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

export const GeneOrganGraph = ( {verified, selectedGenes}: GeneOrganGraphType ) => {

    console.log('enter - GeneOrganGraph')
    console.log('verified', verified)
    
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
        loadData(driver, selectedGenes, verified,  onData)

    },[selectedGenes, verified] )

    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      

    const minWidth = window.innerWidth -38 -300
    const minHeight = window.innerHeight -60

    return ( 
        <ForceGraph2D 
            ref={forceRef}
            width={minWidth}
            height={minHeight}
            graphData={data}
            backgroundColor='white'
            nodeId='name'  
            nodeColor='nodeColor' 
            nodeLabel='name' 
            linkDirectionalArrowRelPos={1} 
            linkDirectionalArrowLength={2} 
            cooldownTicks={100}
            onEngineStop={ () => forceRef.current?.zoomToFit(400)} 

            nodeCanvasObjectMode={() => 'after'} 
            nodeCanvasObject={paintNode}
            />
    )
}

