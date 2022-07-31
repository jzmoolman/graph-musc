
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Driver }  from  'neo4j-driver'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, NodeObject }  from 'react-force-graph-2d'
import { CustomNodeObject, Force2DData, GraphScheme, paintNode } from '../tools/graphtools'
import { 
    loadGeneData,
    loadOrganData,
    loadSyndromeGeneData,
    loadSyndromeOrganData,
    loadSyndromeGeneOrganData
 } from '../tools/grapgdata'
import { positions } from '@mui/system'
import { Box } from '@mui/material'
import ReactDOM from 'react-dom'

const drawerWidth = 350;

type BaseGraphProps = {
    drawerOpen: boolean
    name: string
    verified: boolean
    genes: string[]
    organs: string[]
    syndromes: string[]
    graphScheme: GraphScheme
}
export const BaseGraph = ( {drawerOpen, name, verified, genes, organs,syndromes, graphScheme} : BaseGraphProps ) => {

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
                        backgroundColor: 'primary',
                        position: "absolute",
                        margin: "2px 0px 2px 0px",
                        left: nodePosition.x,
                        top: nodePosition.y,
                        border:'1px solid',
                        width: 250,
                        height: 300
                    }}
                >
                    <div>
                        <div style={{ display: "flex" }}>
                        <span style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                            <strong>{(nodeHover as CustomNodeObject).name.toUpperCase()}</strong>
                        </span>
                        <span
                            className="titleDate"
                            style={{
                            marginRight: "10px"
                            }}
                        >
                            {" - "}
                            DATE
                        </span>
                        {/* {!selectedNode.current_case && (
                            <span
                            style={{ cursor: "pointer", marginLeft: "auto" }}
                            onClick={() => {}}
                            >
                            <i className="fal fa-folder-plus" />
                            </span>
                        )} */}
                        </div>
                    </div>
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
        console.log('Reload data')
        const onData = (data: Force2DData) =>{
            console.log(data)
            setData(data)
        }
        console.log('name',name)

        if (name === 'gene') {
          loadGeneData(driver, verified, genes, organs, graphScheme, onData)
        } else if (name === 'organ')
          loadOrganData(driver, verified, genes, organs, graphScheme, onData)
        else if ( name === 'syndrome-gene') {
          loadSyndromeGeneData(driver, verified,  syndromes, genes, graphScheme, onData)
        } else if ( name === 'syndrome-organ') {
          loadSyndromeOrganData(driver, verified,  syndromes, organs, graphScheme, onData)
        } else if ( name === 'syndrome-gene-organ') {
          loadSyndromeGeneOrganData(driver, verified,  syndromes, genes, organs, graphScheme, onData)
        }

    },[ name, verified, genes, organs,syndromes, graphScheme] )
    
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

