import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, NodeObject }  from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import { CustomNodeObject,  Force2DData, GraphName, GraphScheme, paintNode, GeneNodeObject, SyndromeNodeObject } from '../tools/graphtools'
import { defaultGraphScheme } from '../tools/graphtools';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { 
    loadGeneOrganData,
    loadGeneDiseaseData,
    loadGeneSubtypeData,
    loadOrganData,
    loadDiseaseData,
    loadSyndromeDiseaseData,
    loadSyndromeGeneDiseaseData
 } from '../tools/graphdata'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import ReactDOM from 'react-dom'


const drawerWidth = 350;

type BaseGraphProps = {
    drawerOpen: boolean
    width: number
    height: number
    name: GraphName
    genes: string[]
    organs: string[]
    syndromes: string[]
    diseases: string[]
    finalVerdict: string
    graphScheme: GraphScheme
    enableHover?: boolean
    enableZoom?: boolean
    onClick?: () => void
    onMouseOver?: () => void  
    onMouseOut?: () => void
}
export const BaseGraph = ( { 
    drawerOpen, 
    width=200, 
    height=300, 
    name,  
    genes, 
    organs, 
    syndromes,
    diseases,
    finalVerdict,
    graphScheme,
    enableHover,
    enableZoom,
    onClick,
    onMouseOver,
    onMouseOut
} : BaseGraphProps ) => {

    console.log('enter - BaseGraph', name)
    
    const [nodeHover, setNodeHover] = useState<NodeObject|null>(null)
    // const [nodePosition, setNodePosition] = useState<{x:number, y:number}>({x:0 , y:0})

    const handleCardClose = () => {
        setNodeHover(null);
      };

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e)  => {
        let position: {x: number, y: number} = {x:0, y:0}
        position.x = e?.pageX
        position.y = e?.pageY
        // setNodePosition(position)
    }

    const handleNodeHover = (node: NodeObject | null, previousNode: NodeObject | null) => {
        console.log('handleNodeHover - enableHover', enableHover )
        console.log('handleNodeHover - nodeHover', nodeHover )
        console.log('handleNodeHover - node', node)
        if ( enableHover && nodeHover === null && node   ) {
            console.log('handleNodeHover - Enter', node)
            setNodeHover(node)
        }  
    }

    const handleClick:React.MouseEventHandler<HTMLDivElement> = (event) => {
        console.log('onClick')
        if (onClick)
            onClick()

    }

    const handleNodeClick = (node: NodeObject, event: MouseEvent  ) => {
        console.log('node', node)
        console.log('evet', event)
    }

    const navigate = useNavigate()

    const handleNodeTypeClick = (nodeType : string) => {
        navigate(`/graph/${nodeType}`)
    }

    const getWidth = (box: number) => {
        let number = Number(document.getElementById(`graph-box${box}`)?.offsetWidth )
        console.log('getWidht', number)
        if ( typeof number === 'number' && number === number) {
            console.log('getWidth is a number', number)
            return number-12
        } else {
            console.log('getWidth NaN', number)
            return 200
        }
    }

    const renderHover = () => {
        //Check if nodeHover is set, if then render card
        if (nodeHover) {
            if ((nodeHover as GeneNodeObject).nodeType === 'gene') {
                const _node = nodeHover as GeneNodeObject; 
                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 80,
                            width: 300,
                            height: 300
                            
                        }}
                    >
                        <Card 
                            sx={{ 
                                border:0.1,
                                minWidth:275, 
                                borderColor: 'primary.main'
                            }}
                        >

                            <CardHeader 
                                title={_node.name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                    </IconButton>
                                }
                            />
                            
                            <CardContent>
                                <Box>
                                    <BaseGraph
                                        drawerOpen={false}
                                        width={getWidth(1)}
                                        height={300}
                                        //name={((nodeHover as CustomNodeObject).nodeType as GraphName)}
                                        //Do we only want to show the disease grapgh each time?
                                        name='disease'
                                        genes={[_node.name]}
                                        organs={[]}
                                        syndromes={[]}
                                        diseases={[]}
                                        finalVerdict='Confirmed'
                                        graphScheme={defaultGraphScheme}
                                        enableZoom={false}
                                        onClick={() => handleNodeTypeClick(_node.nodeType)}
                                    />
                                    <p>
                                        <b> Name: </b>  {_node.fullName}
                                    </p>
                                    <p>
                                        <b> Alternate Names : </b>
                                        {_node.altName}
                                    </p>
                                    <div>
                                        <b>  Description: </b> 
                                        {_node.description}
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>,
                    document.body
                ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'organ'){
                const _node = nodeHover as CustomNodeObject
                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 80,
                            width: 250,
                            height: 300
                        }}
                    >
                        <Card 
                            sx={{ 
                                border:1,
                                minWidth:275, 
                                borderColor: 'primary.main'
                            }}
                        >
                            <CardHeader 
                                title={_node.name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton 
                                        onClick={handleCardClose}
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Box>
                                    <BaseGraph
                                        drawerOpen={false}
                                        width={getWidth(1)}
                                        height={300}
                                        name={((nodeHover as CustomNodeObject).nodeType as GraphName)}
                                        genes={[]}
                                        organs={[(nodeHover as CustomNodeObject).name]}
                                        syndromes={[]}
                                        diseases={[]}
                                        finalVerdict='Confirmed'
                                        graphScheme={defaultGraphScheme}
                                        enableZoom={false}
                                        onClick={() => handleNodeTypeClick((nodeHover as CustomNodeObject).nodeType)}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>,
                    document.body
                ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'disease'){
                const _node = nodeHover as CustomNodeObject
                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 80,
                            width: 250,
                            height: 300
                        }}
                    >
                        <Card 
                            sx={{ 
                                border:1,
                                minWidth:275, 
                                borderColor: 'primary.main'
                            }}
                        >
                            <CardHeader 
                                title={(nodeHover as CustomNodeObject).name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                    </IconButton>
                            }
    
                            />
                            <CardContent>
                            <Box>
                                <BaseGraph
                                    drawerOpen={false}
                                    width={getWidth(1)}
                                    height={300}
                                    name={_node.nodeType as GraphName}
                                    genes={[]}
                                    organs={[]}
                                    syndromes={[]}
                                    diseases={[(nodeHover as CustomNodeObject).name]}
                                    finalVerdict='Confirmed'
                                    graphScheme={defaultGraphScheme}
                                    enableZoom={false}
                                    onClick={() => handleNodeTypeClick((nodeHover as CustomNodeObject).nodeType)}
                            />
                            </Box>
                            </CardContent>
                        </Card>
                    </Box>,
                    document.body
                ))
            } else if ((nodeHover as CustomNodeObject).nodeType === 'syndrome'){
                const _node = nodeHover as SyndromeNodeObject
                console.log('hereditaryType',_node.hereditaryType)

                return (ReactDOM.createPortal(
                    <Box
                        className="nodeCard"
                        sx={{
                            position: "absolute",
                            margin: "2px 0px 2px 0px",
                            left: 20,
                            top: 80,
                            width: 250,
                            height: 300
                        }}
                    >
                        <Card sx={{
                                border:1,
                             minWidth:275,                             
                            borderColor: 'primary.main'
                        }}>

                            <CardHeader 
                                title={(nodeHover as CustomNodeObject).name}
                                // subheader={(nodeHover as CustomNodeObject).nodeType}
                                action={
                                    <IconButton onClick={handleCardClose}  aria-label="close"> <CloseIcon />
                                    </IconButton>
                            }
    
                            />
                            <CardContent>
                            <Box>
                                <BaseGraph
                                drawerOpen={false}
                                width={getWidth(1)}
                                height={300}
                                name={_node.nodeType as GraphName}
                                genes={[]}
                                organs={[]}
                                syndromes={[_node.name]}
                                diseases={[]}
                                finalVerdict='Confirmed'
                                graphScheme={defaultGraphScheme}
                                enableZoom={false}
                                onClick={() => handleNodeTypeClick(_node.nodeType)}
                            />
                            {/* // Armando */}
                            <p>
                                <b> Inheritance Type: </b>  {_node.hereditaryType}
                            </p>
                            {/* // Aramando - end */}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>,
                document.body
            ))
        } 
        
    }
        return (<></>)

    }

    if (drawerOpen) {
        width = width - drawerWidth
    }
    
    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<Force2DData>( {nodes: [], links: []} )

    useEffect( () => {
        console.log('loading data ...')
        const onData = (data: Force2DData) =>{
            console.log(data)
            setData(data)
        }
        console.log('Graph name',name)
        switch (name) {
            case 'gene-organ': {
                loadGeneOrganData(driver, genes, organs,finalVerdict, graphScheme, onData)
                break
            }
            case 'gene-disease': {
                loadGeneDiseaseData(driver, genes, finalVerdict, graphScheme, onData)
                break
            }
            case 'gene-subtype': {
                loadGeneSubtypeData(driver, genes, organs,finalVerdict, graphScheme, onData)
                break
            }
            case 'organ': {
                loadOrganData(driver, genes, organs, finalVerdict, graphScheme, onData)
                break
            }
            case 'disease': {
                loadDiseaseData(driver, diseases, genes, finalVerdict, graphScheme, onData)
                break
            }
            case 'syndrome-disease': {
                loadSyndromeDiseaseData(driver, syndromes, finalVerdict, graphScheme, onData)
                break
            }
            case 'syndrome-gene-disease': {
                loadSyndromeGeneDiseaseData(driver, syndromes, finalVerdict, graphScheme, onData)
                break
            }
        }

    },[ name, genes, organs, diseases, syndromes, finalVerdict, graphScheme] )
    
    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      


    let handleEngineStop: ()=>void | undefined = () => {
        if (forceRef.current) {
            (forceRef.current as ForceGraphMethods).zoomToFit(400);
        }
    }
    
    if (!graphScheme.fitViewPort) {
        if (forceRef.current) {}
    }

    return (
        <Box id='graph-box' sx={{padding:'2px'}} 
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseOver={(e)=>{
                if (onMouseOver) 
                    onMouseOver()
            }}
            onMouseOut={(e)=>{
                if (onMouseOut) 
                    onMouseOut()
            }}
            
            
        >
            {renderHover()}
            <ForceGraph2D 
                
                ref={forceRef}
                width={width}
                height={height}
                graphData={data}
                nodeId='name'  
                nodeColor='nodeColor' 
                nodeLabel='name' 
                linkDirectionalArrowRelPos={1} 
                linkDirectionalArrowLength={2} 
                cooldownTicks={100}
                onEngineStop={handleEngineStop} 
                nodeVal={graphScheme.nodeVal}
                nodeRelSize={graphScheme.nodeRelSize}
                nodeCanvasObjectMode={() => 'after'} 
                nodeCanvasObject={paintNode}
                onNodeHover={handleNodeHover}
                onNodeClick={handleNodeClick}
                enableZoomInteraction={enableZoom}
            />
            
        </Box>
    )
}


