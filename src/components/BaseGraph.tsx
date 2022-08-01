
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, NodeObject }  from 'react-force-graph-2d'
import { CustomNodeObject, Force2DData, GraphScheme, paintNode } from '../tools/graphtools'
import { 
    loadGeneData,
    loadOrganData,
    loadDiseaseGeneData,
    loadSyndromeGeneData,
    loadSyndromeOrganData,
    loadSyndromeGeneOrganData
 } from '../tools/graphdata'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import ReactDOM from 'react-dom'

const drawerWidth = 350;

type BaseGraphProps = {
    drawerOpen: boolean
    name: string
    genes: string[]
    organs: string[]
    syndromes: string[]
    diseases: string[]
    finalVerdict: string
    graphScheme: GraphScheme
}
export const BaseGraph = ( { drawerOpen, name,  genes, organs, 
        syndromes, diseases, finalVerdict, graphScheme} : BaseGraphProps ) => {

    console.log(`enter - ${name}Graph`)
    
    const isMounted = useRef(false)
    const [renderTick, setRenderTick] = useState(0);
    const [nodeHover, setNodeHover] = useState<NodeObject|null>(null)
    const [nodePosition, setNodePosition] = useState<{x:number, y:number}>({x:0 , y:0})

    const handleResize = () => {
        console.log('onResize')
        console.log('renderTick', renderTick )
        setRenderTick(renderTick => renderTick + 1 )
    }

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e)  => {
        let position: {x: number, y: number} = {x:0, y:0}
        position.x = e?.pageX
        position.y = e?.pageY
        setNodePosition(position)
    }

    const handleNodeHover = (node: NodeObject | null, previousNode: NodeObject | null ) => {
        console.log('handleNodeHove', node)
        if ( node ) {
            setNodeHover(node)
        }  else {
            setNodeHover(null)
        }  
    }

    const handleNodeClick = (node: NodeObject, event: MouseEvent  ) => {
        console.log('node', node)
        console.log('evet', event)
    }

    const renderHover = () => {
        //Check if nodeHover is set, if then render card
        if ( nodeHover ) {
            console.log('renderHover', nodeHover)
            console.log('renderHover', nodePosition)
            return (ReactDOM.createPortal(
                <Box
                    className="nodeCard"
                    sx={{
                        position: "absolute",
                        margin: "2px 0px 2px 0px",
                        // left: nodePosition.x,
                        // top: nodePosition.y,
                        left: 40,
                        top: 100,
                        width: 250,
                        height: 300
                    }}
                >
                    <Card sx={{ minWidth:275}}>
                        <CardHeader 
                            title={(nodeHover as CustomNodeObject).name}
                            subheader={(nodeHover as CustomNodeObject).nodeType}

                        />
                        <CardContent>
                            Detail
                        </CardContent>
                    </Card>
                </Box>,
                document.body
            ))
        } 
        return (<></>)

    }

    useEffect(()=>{
        console.log('Graph mounted')
        isMounted.current = true
        window.addEventListener("resize", handleResize )
    },[])

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<Force2DData>( {nodes: [], links: []} )

    useEffect( () => {
        console.log('loading data ...')
        const onData = (data: Force2DData) =>{
            console.log(data)
            setData(data)
        }
        console.log('Graph name',name)

        if (name === 'gene') {
          loadGeneData(driver, genes, organs,finalVerdict, graphScheme, onData)
        } else if (name === 'organ')
          loadOrganData(driver, genes, organs, finalVerdict, graphScheme, onData)
        else if ( name === 'syndrome-gene') {
          loadSyndromeGeneData(driver, syndromes, genes, finalVerdict, graphScheme, onData)
        } else if ( name === 'syndrome-organ') {
          loadSyndromeOrganData(driver, syndromes, organs, finalVerdict, graphScheme, onData)
        } else if ( name === 'syndrome-gene-organ') {
          loadSyndromeGeneOrganData(driver, syndromes, genes, organs,finalVerdict, graphScheme, onData)
        } else if ( name ==='disease-gene') {
          loadDiseaseGeneData(driver, diseases, genes, finalVerdict, graphScheme, onData)
        }
         

    },[ name, genes, organs, diseases, syndromes, finalVerdict, graphScheme] )
    
    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      

    let Width = window.innerWidth -18
    if (drawerOpen) {
        Width = window.innerWidth -18 - drawerWidth
    }
    const Height = window.innerHeight -85
    let handleEngineStop: ()=>void | undefined = () => {
        if (forceRef.current)
            (forceRef.current as ForceGraphMethods).zoomToFit(400) 
    }
    
    if (!graphScheme.fitViewPort) {
        if (forceRef.current) {}
    }

    return (
        <div onMouseMove={handleMouseMove}>
            {renderHover()}
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
                // onEngineStop={ () => forceRef.current?.zoomToFit(100)} 
                onEngineStop={handleEngineStop} 
                nodeVal={graphScheme.nodeVal}
                nodeRelSize={graphScheme.nodeRelSize}
                nodeCanvasObjectMode={() => 'after'} 
                nodeCanvasObject={paintNode}
                onNodeHover={handleNodeHover}
                onNodeClick={handleNodeClick}
            />
            
        </div>
    )
}


