import ReactDOM from 'react-dom'
        //call back back, think of another way to do this/set
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject }  from 'react-force-graph-2d'

import { useNavigate } from 'react-router-dom'

import { 
        FinalVerdict,
        Force2DData,
        GraphName,
        GraphScheme,
        paintNode,
    } from '../tools/graphtools'

import { GeneNode, Node } from '../data/types.forcegraph'

// import { 
//     loadGeneOrganData,
//     loadGeneDiseaseData,
//     loadGeneDiseaseSubtypeData,
//     loadOrganGeneData,
//     loadDiseaseData,
//     loadSyndromeDiseaseData,
//     loadSyndromeGeneDiseaseData,
//  } from '../tools/graphdata'

import { Box, Button, Hidden, useTheme,  } from '@mui/material'
import gene_organ_img from '../assets/gene-organ.png'
import gene_subtype_img from '../assets/gene-subtype.png'
import { Gene_Organs, load_gene_affects_organ_filter_specialist } from '../data/gene-organ.neo4j'
import { build_gene_affects_organ_graph } from '../data/gene-organ.forcegraph'
import { Gene_OrganDiseases, load_gene_affect_organs_affect_disease } from '../data/gene-organdiseases.ne04j'
import { build_gene_organ_disease_graph } from '../data/gene-organ-disease.forcegraph'
import { GeneCauseDisease, load_gene_cause_disease } from '../data/gene-cause-disease.neo4j'
import { build_gene_disease_graph_2d } from '../data/gene-disease.forcegraph2d'
import { build_syndrome_disease,  } from '../data/syndrome-disease.forcegraph2d'
import { SyndromeGeneCauseDisease, load_syndrome_gene_cause_disease } from '../data/syndryome-gene-disesae.neo4j'


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
    enableTitle?: boolean
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
    enableTitle,
    enableHover,
    enableBack,
    enableZoom,
    geneData,
    onClick,
    onMouseOver,
    onMouseOut,
    onGeneClick,
} : GraphProps ) => {
    
    const [mounted, setMounted] = useState(false)
    const [nodeClicked, setNodeClicked] = useState<NodeObject|null>(null)

    const theme = useTheme()

    useEffect( ()=> {
        setMounted(true)
    },[])

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e)  => {
        let position: {x: number, y: number} = {x:0, y:0}
        position.x = e?.pageX
        position.y = e?.pageY
    }

    const handleClick:React.MouseEventHandler<HTMLDivElement> = (event) => {
        // console.log('--->Debug: Graph.tsx.handleClick', event)
        if (onClick) {
            onClick()
        }
    }

    const handleNodeClick = (node: NodeObject, event: MouseEvent  ) => {
        // console.log('--->Debug: handleNodeClick', node)
        // callback to show geneCard
        if ((node as Node).type === 'gene' ) {
            if (onGeneClick) {
                // console.log('--->Debug: handleNodeClick.gene', _node.name)
                onGeneClick((node as GeneNode).name)
            }
        } 
        setNodeClicked(node)
    }

    const handleNodeHover = (node: NodeObject | null , previousNode: NodeObject | null) => {
        // console.log('---->Debug: handleNodeHover', node)
    }

    const navigate = useNavigate()
  
    const handleBackClick = () => {
        // console.log('---->Debug: handleBackClick', specialist)
        navigate(`/site/${specialist}`)
    }

    const context = useContext(Neo4jContext), driver = context.driver
    const [data, setData] =  useState<Force2DData>( {nodes: [], links: []} )

    useEffect( () => {

        const onData = (data: Force2DData) =>{
            setData(data)
        }

        const handleGene_Organs_Data = ( data: Gene_Organs[]) => {
            // console.log('---->Debug: handleGene_Organs_Data data', data)
            let _data = build_gene_affects_organ_graph(data);
            setData(_data)
        }
        const handleGene_OrganDisease_Data = (data: Gene_OrganDiseases[]) => {
            // console.log('---->Debug: handleGene_OrganDisease_Data data', data)
            let _data = build_gene_organ_disease_graph(data);
            setData(_data)
        }
        const handleGeneDiseaseData = (data: GeneCauseDisease[]) => {
            // console.log('---->Debug: handleGeneDiseaseData data', data)
            let _data = build_gene_disease_graph_2d(data);
            // console.log('---->Debug: handleGeneDiseaseData _data', _data)
            setData(_data)
        }
        const handleSydromeDiseaseData = (data: SyndromeGeneCauseDisease[]) => {
            // console.log('---->Debug: handleSydromeDiseaseData data', data)
            let _data = build_syndrome_disease(data);
            // console.log('---->Debug: handleGeneDiseaseData _data', _data)
            setData(_data)
        }

        switch (name) {
            case 'gene-organ': {
                load_gene_affects_organ_filter_specialist(driver, { 
                    specialist: specialist, 
                    geneFilter: genes,
                    organFilter: organs,
                    onData: handleGene_Organs_Data,
                })
                break
            }
            case 'gene-disease': {
                load_gene_affect_organs_affect_disease(driver, {
                    specialist: specialist,
                    geneFilter: genes,
                    organFilter: organs,
                    onData: handleGene_OrganDisease_Data,
                })
                break
            }
            case 'gene-disease-subtype': {
                // loadGeneDiseaseSubtypeData(driver, specialist,diseases, genes,finalVerdict, graphScheme, onData)
             
                break
            }
            case 'organ': {
                // loadOrganGeneData(driver, specialist, genes, organs, finalVerdict, graphScheme, onData)
                load_gene_affects_organ_filter_specialist(driver, { 
                    specialist: specialist, 
                    geneFilter: genes,
                    organFilter: organs,
                    onData: handleGene_Organs_Data,
                })
                break
            }
            case 'disease': {
                load_gene_cause_disease(driver, {
                    specialist: specialist,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleGeneDiseaseData,
                })
                break
            }
            case 'syndrome-disease': {
                load_syndrome_gene_cause_disease(driver, {
                    specialist: specialist,
                    syndromeFilter: syndromes,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleSydromeDiseaseData,
                })
                break
            }
            case 'syndrome-gene-disease': {
                // loadSyndromeGeneDiseaseData(driver, specialist, syndromes, finalVerdict, graphScheme, onData)
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

    const TitleBox = ({hidden}:{hidden: boolean})=> {
        return (!hidden?
            <Box
                id='back-box'
                sx={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    color: 'primary.main'
                }}
            >
                {specialist === 'Genric'?'Specialist: General':`Specialist: ${specialist}`}
                                
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
                nodeId='id'  
                nodeColor='fill' 
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
            <TitleBox hidden={!enableTitle}></TitleBox>
        </Box>
    )
}
