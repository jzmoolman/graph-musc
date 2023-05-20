import ReactDOM from 'react-dom'
        //call back back, think of another way to do this/set
import { useState, useContext, useEffect, useRef, MutableRefObject } from 'react'
import { Neo4jContext } from 'use-neo4j'
import ForceGraph2D, { ForceGraphMethods, GraphData, NodeObject }  from 'react-force-graph-2d'

import { useNavigate } from 'react-router-dom'

import { 
        FinalVerdict,
        GraphName,
        ForceGraphScheme,
    } from '../tools/graphtools'

import { GeneNode, Node } from '../data/forcegraph/types.forcegraph'

import { Box, Button, Hidden, useTheme,  } from '@mui/material'
import gene_organ_img from '../assets/gene-organ.png'
import gene_subtype_img from '../assets/gene-subtype.png'
import { GeneAffectOrgan,  load_gene_affect_organ,  } from '../data/neo4j/gene-_-organ.neo4j'
import { build_gene_affect_organ_forcegraph2d,  } from '../data/forcegraph/gene-_-organ.forcegraph'
import { GeneCauseDisease, load_gene_cause_disease } from '../data/neo4j/gene-cause-disease.neo4j'
import { build_gene_disease_forcegraph2d, build_gene_disease_subtype_foregraph2d } from '../data/gene-disease.forcegraph2d'
import { build_syndrome_disease, build_syndrome_gene_disease,  } from '../data/syndrome-disease.forcegraph2d'
import { SyndromeGeneCauseDisease, load_syndrome_gene_cause_disease } from '../data/neo4j/syndryome-gene-disesae.neo4j'
import { paintNode } from '../data/forcegraph/utils.forcegraph'


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
    gender: string,
    graphScheme: ForceGraphScheme
    enableHover?: boolean
    enableTitle?: boolean
    enableBack?: boolean
    enableZoom?: boolean
    geneData?: any[]
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
    gender,
    graphScheme,
    enableTitle,
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
    const [data, setData] =  useState<GraphData>( {nodes: [], links: []} )

    useEffect( () => {

        // Gene Centric
        const handleGeneOrganData = ( data: GeneAffectOrgan[]) => {
            // console.log('---->Debug: handleGene_Organs_Data data', data)
            let _data = build_gene_affect_organ_forcegraph2d(data);
            setData(_data)
        }
        
        const handleGeneDiseaseData = (data: GeneCauseDisease[]) => {
            // console.log('---->Debug: handleGeneDiseaseData data', data)
            let _data = build_gene_disease_forcegraph2d(data);
            // console.log('---->Debug: handleGeneDiseaseData _data', _data)
            setData(_data)
        }
       
        const handleGeneDiseaseSubtypeData =(data: GeneCauseDisease[]) => {
            // console.log('---->Debug: handleGeneDiseaseSubtypeData data', data)
            let _data = build_gene_disease_subtype_foregraph2d(data);
            // console.log('---->Debug: handleGeneDiseaseSubtypeData data', _data)
            setData(_data)
        }
        // Organ Centric
        // use the same data build_gene_affect_organ_forcegraph2d

        // Disease Centric
        // use the samea data handleGeneDiseaseData

        const handleSydromeDiseaseData = (data: SyndromeGeneCauseDisease[]) => {
            // console.log('---->Debug: handleSydromeDiseaseData data', data)
            let _data = build_syndrome_disease(data);
            // console.log('---->Debug: handleGeneDiseaseData _data', _data)
            setData(_data)
        }

        const handleSydromeGeneDiseaseData = (data: SyndromeGeneCauseDisease[]) => {
            // console.log('---->Debug: handleSydromeDiseaseData data', data)
            let _data = build_syndrome_gene_disease(data);
            // console.log('---->Debug: handleGeneDiseaseData _data', _data)
            setData(_data)
        }

        switch (name) {
            // Gene Centric
            case 'gene-organ': {
                // Any limit to specialist if no gene filter is applied
                console.log('---->Debug: GraphViewport UseEffect genes, specialist', genes, specialist, gender)
                load_gene_affect_organ( driver, {
                    specialist: genes.length === 0?specialist: 'None', 
                    gender: gender,
                    geneFilter: genes,
                    organFilter: organs,
                    onData: handleGeneOrganData,
                    })
                break
            }
            case 'gene-disease': {
                // load_gene_affect_organs_affect_disease(driver, {
                    load_gene_cause_disease(driver,{
                    specialist: genes.length === 0?specialist: 'None', 
                    gender: gender,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleGeneDiseaseData,
                })
                break
            }
            case 'gene-disease-subtype': {
                load_gene_cause_disease(driver,{
                    specialist: genes.length === 0?specialist: 'None', 
                    gender: gender,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleGeneDiseaseSubtypeData,
                })
                break
            }

            // Organ Centric
            case 'organ-gene': {
                load_gene_affect_organ( driver, {
                    specialist: organs.length === 0?specialist: 'None', 
                    gender: gender,
                    geneFilter: genes,
                    organFilter: organs,
                    onData: handleGeneOrganData,
                })
                break
            }

            //  Disease Centric
            case 'disease-gene': {
                load_gene_cause_disease(driver, {
                    specialist: diseases.length === 0?specialist: 'None', 
                    // specialist: specialist,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleGeneDiseaseData,
                })
                break
            }
            
            // Syndrome Centric
            case 'syndrome-disease': {
                load_syndrome_gene_cause_disease(driver, {
                    specialist: syndromes.length === 0?specialist: 'None', 
                    gender: gender,
                    syndromeFilter: syndromes,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleSydromeDiseaseData,
                })
                break
            }

            case 'syndrome-gene-disease': {
                load_syndrome_gene_cause_disease(driver, {
                    specialist: specialist,
                    gender: gender,
                    syndromeFilter: syndromes,
                    geneFilter: genes,
                    diseaseFilter: diseases,
                    onData: handleSydromeGeneDiseaseData,
                })
                break
            }
        }

    },[ name, genes, organs, diseases, syndromes, finalVerdict, gender, graphScheme] )
    
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
                // NodeRelSize determine the node size 
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
