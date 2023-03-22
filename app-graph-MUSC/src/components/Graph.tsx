import ReactDOM from 'react-dom'
        //call back back, think of another way to do this/set
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, NodeObject }  from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'

import { 
        FinalVerdict,
        CustomNodeObject,
        Force2DData,
        GraphName,
        GraphScheme,
        paintNode,
    } from '../tools/graphtools'

import { 
    loadGeneOrganData,
    loadGeneDiseaseData,
    loadGeneDiseaseSubtypeData,
    loadOrganGeneData,
    loadDiseaseData,
    loadSyndromeDiseaseData,
    loadSyndromeGeneDiseaseData,
 } from '../tools/graphdata'

import { Box, Button,  } from '@mui/material'
import gene_organ_img from '../assets/gene-organ.png'
import gene_subtype_img from '../assets/gene-subtype.png'

// const drawerWidth = 450;

const getimg = (name: GraphName) => {
    switch (name) {
        case 'gene-organ': return gene_organ_img;break;
        case 'gene-disease-subtype': return gene_subtype_img; break
        default: return gene_subtype_img; break
    }
}

type GraphProps = {
    width: number
    height: number
    name: GraphName
    specialist: string
    genes: string[]
    organs: string[]
    syndromes: string[]
    diseases: string[]
    finalVerdict: FinalVerdict
    graphScheme: GraphScheme
    enableHover?: boolean
    enableBack?: boolean
    enableZoom?: boolean
    geneData?:any[]
    onClick?: () => void
    onMouseOver?: () => void  
    onMouseOut?: () => void
    onGeneClick?: (gene: string) => void
}
export const Graph = ( { 
    width=600, 
    height=500, 
    name, 
    specialist,
    genes, 
    organs, 
    syndromes,
    diseases,
    finalVerdict,
    graphScheme,
    enableHover,
    enableBack,
    enableZoom,
    onClick,
    onMouseOver,
    onMouseOut,
    onGeneClick,
} : GraphProps ) => {
    
    const [mounted, setMounted] = useState(false)
    const [nodeClicked, setNodeClicked] = useState<NodeObject|null>(null)

    useEffect( ()=> {
        setMounted(true)
    },[])

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e)  => {
        let position: {x: number, y: number} = {x:0, y:0}
        position.x = e?.pageX
        position.y = e?.pageY
    }

    const handleClick:React.MouseEventHandler<HTMLDivElement> = (event) => {
        console.log('--->Debug: handleClick', event)
        //call back back, think of another way to do this
        if (onClick) {
            onClick()
        }
    }

    const handleNodeClick = (node: NodeObject, event: MouseEvent  ) => {
        // console.log('--->Debug: handleNodeClick', node)
        // callback to show geneCard
        const _node = node as CustomNodeObject; 
        if (_node.nodeType === 'Gene' ) {
            if (onGeneClick) {
                // console.log('--->Debug: handleNodeClick.gene', _node.name)
                onGeneClick(_node.name)
            }
        } 
        setNodeClicked(node)
    }

    const handleNodeHover = (node: NodeObject | null , previousNode: NodeObject | null) => {
        // console.log('---->Debug: handleNodeHover', node)
    }

    const navigate = useNavigate()
  
    const handleBackClick = () => {
        console.log('---->Debug: handleBackClick', specialist)
        navigate(`/site/${specialist}`)
    }

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<Force2DData>( {nodes: [], links: []} )

    useEffect( () => {

        const onData = (data: Force2DData) =>{
            setData(data)
        }

        switch (name) {
            case 'gene-organ': {
                loadGeneOrganData(driver, specialist, genes, organs,finalVerdict, graphScheme, onData)
                break
            }
            case 'gene-disease': {
                loadGeneDiseaseData(driver, specialist, genes, finalVerdict, graphScheme, onData)
                break
            }
            case 'gene-disease-subtype': {
                loadGeneDiseaseSubtypeData(driver, specialist,diseases, genes,finalVerdict, graphScheme, onData)
                break
            }
            case 'organ': {
                loadOrganGeneData(driver, specialist, genes, organs, finalVerdict, graphScheme, onData)
                break
            }
            case 'disease': {
                loadDiseaseData(driver, specialist, diseases, genes, finalVerdict, graphScheme, onData)
                break
            }
            case 'syndrome-disease': {
                loadSyndromeDiseaseData(driver, specialist, syndromes, finalVerdict, graphScheme, onData)
                break
            }
            case 'syndrome-gene-disease': {
                loadSyndromeGeneDiseaseData(driver, specialist, syndromes, finalVerdict, graphScheme, onData)
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
       
    const BackBox = ({hidden}:{hidden: boolean}) =>{
        return (!hidden?
            <Box
                id='back-box'
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                }}
            >
                <Button  variant="outlined" onClick={handleBackClick}> 
                     Back
                </Button>
                
            </Box>:<></>
        )
    }
    
    return ( 
        <Box id='graph-box' 
            sx={{
                position: 'relative',
                padding:'2px',
            }} 
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseOver={(e)=>{
                if (onMouseOver) {
                    onMouseOver()
                }
            }}
            onMouseOut={(e)=>{
                if (onMouseOut)  {
                    onMouseOut()
                }
            }}
        > 

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
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                enableZoomInteraction={true}
            />
            <BackBox hidden={!enableBack}/>
        </Box>
    )
}
