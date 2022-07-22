
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Driver }  from  'neo4j-driver'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods }  from 'react-force-graph-2d'
import { Force2DData, GraphScheme, paintNode } from '../tools/graphtools'
import { loadGeneData, loadOrganData, loadSyndromeData } from '../tools/grapgdata'


type BaseGraphProps = {
    name: string
    verified: boolean
    genes: string[]
    organs: string[]
    syndromes: string[]
    graphScheme: GraphScheme
}
export const BaseGraph = ( {name, verified, genes, organs,syndromes, graphScheme} : BaseGraphProps ) => {

    console.log(`enter - ${name}Graph`)
    
    const isMounted = useRef(false)
    const [renderTick, setRenderTick] = useState(0);

    const onResize = () => {
        console.log('onResize')
        let tick = renderTick + 1
        console.log('renderTick', tick )
        setRenderTick(tick )
    }

    useEffect(()=>{
        console.log('Graph mounted')
        isMounted.current = true
        window.addEventListener("resize", onResize )
    },[])

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<Force2DData>( {nodes: [], links: []} )

    useEffect( () => {
        console.log('Reload data')
        const onData = (data: Force2DData) =>{
            console.log(data)
            setData(data)
        }

        if (name === 'gene') {
          loadGeneData(driver, verified, genes, organs, graphScheme, onData)
        } else if (name === 'organ')
          loadOrganData(driver, verified, genes, organs, graphScheme, onData)
        else if ( name === 'syndrome') {
          loadSyndromeData(driver, verified,  syndromes, genes, graphScheme, onData)
        }

    },[ name, verified, genes, organs,syndromes, graphScheme] )
    


    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      

    const Width = window.innerWidth -18
    const Height = window.innerHeight -85

    return ( 
        <ForceGraph2D 
            ref={forceRef}
            
            
            width={Width}
            height={Height}
            graphData={data}
            backgroundColor='white'
            nodeId='name'  
            nodeColor='nodeColor' 
            nodeLabel='name' 
            linkDirectionalArrowRelPos={1} 
            linkDirectionalArrowLength={2} 
            cooldownTicks={100}
            onEngineStop={ () => forceRef.current?.zoomToFit(100)} 
            nodeVal={graphScheme.nodeVal}
            nodeRelSize={graphScheme.nodeRelSize}
            nodeCanvasObjectMode={() => 'after'} 
            nodeCanvasObject={paintNode}
            />
    )
}

