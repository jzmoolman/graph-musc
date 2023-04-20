// Forked from: GeneRiskGraph__03.jsx
// Changed to TSX

import { useEffect, useRef , useState} from "react"
import * as d3 from "d3"

import './ForceGraph.css'
import { buildForceGraph } from "../packagesz/forcegraphz"
import { GraphData } from "react-force-graph-2d"
import { Gene_OrganRisks } from "../data/neo4j/gene-affect-organ.neo4j"
import { Node } from '../data/types.forcegraph'
import { NodeLegends } from "./NodeLegends"
import { GREY_A_FILL, GeneNode } from "../data/types.forcegraph"
const DEBUG = false


type GeneRiskGraphProps = {
    data :GraphData,
    gene?: Gene_OrganRisks,
    gender: string,
    debug?: boolean,
}

export const GeneRiskGraph = ({ 
        data,
        gene,
        gender,
        debug=DEBUG,
    }: GeneRiskGraphProps) => {
    console.log("---->Debug: GeneRiskGraph")
    // console.log("---->Debug: GeneRiskGraph", nodes, links)

    const ref = useRef(null);
    let node 
    let nodes_filtered:any[] = []
    let links_filtered:any[] = []
    const [currentNode, setCurrentNode] = useState<any>(node)

    let currentGeneSelect = gene?.gene.name
    let currentGenderSelect = gender

    useEffect( ()=>   {
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph();

    }, [currentGenderSelect, currentGeneSelect])

    const handleMouseEnter = (d:any)  => {
        console.log('---->Debug: GeneRiskGraph handlemouseenter', d)
        setCurrentNode(d)
    }
    
    const handleMouseLeave = (d:any)  => {
        console.log('---->Debug: GeneRiskGraph handlemouseleave', d)
        setCurrentNode(null)
    }
    
    
    function handleGeneChange(e:any) {
        currentGeneSelect = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph()
    }
    
    function handleGenderChange(e:any) {
        currentGenderSelect = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        filterData()
        buildGraph()
    }
    
    const buildGraph = () => {
        // console.log('---->Debug: GeneRiskGraph.buildGraph')
        if (!currentGeneSelect || !currentGenderSelect)  return 

        const svg = d3.select(ref.current)
        const cx = +svg.attr('width')/3
        const cy = +svg.attr('height')/2

        console.log('---->Debug: svg', svg)
        buildForceGraph(svg, nodes_filtered, links_filtered, handleMouseEnter, handleMouseLeave,cx,cy )
    }

    function filterData() {
        nodes_filtered = []
        links_filtered = []
        // filter by organ that has risk and gender
        if (currentGenderSelect !== 'Both' ) {

            let organs_to_be_removed = data.nodes.filter((d:any,i) => {
                if (d.group === 'Organ' && d.has_risk === true && d.gender.toLowerCase() !== currentGenderSelect.toLowerCase( )) {
                    return true
                } else {
                    return false
                }
            })
            // console.log('---->Debug: filterData organs_to_be_removed', organs_to_be_removed)

            data.nodes.forEach( (node:any) => {
                let item; 
                item = organs_to_be_removed.find( d => d.id === node.id )
                if (item) {
                    //item removed
                } else {
                    nodes_filtered.push(node)
                }
            })
            // console.log('---->Debug: filterData nodes_filtered', nodes_filtered)
        
            // console.log('---->Debug: before filterData links', links)
            // console.log('---->Debug: before filterData links_filtered', links_filtered)
            data.links.forEach( link => {
                let item; 
                // d3 change the data structure for link.source and target
                // console.log('---->Debug: link.target', link.target)
                let id = (typeof link.target === 'object')?link.target.id:link.target
                item = organs_to_be_removed.find( node => node.id === id )
                if (item) {
                    //item removed
                } else {
                    links_filtered.push(link)
                }
            })
            // console.log('---->Debug: after filterData links', links_filtered)

            // filter by organ that only has affect and gender
            let organs_affect_to_be_removed = data.nodes.filter( (d:any) => {
                if (d.group === 'Organ' && d.has_risk === false) {
                    let item;
                    item = nodes_filtered.find(node=> {
                    return node.name === d.name && node.has_risk 
                    })
                    if ( item ){
                        // console.log('---->Debug: i ', item )
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            })
            // console.log('---->Debug: filterData organs_cause_to_be_removed', organs_affect_to_be_removed)


            let tmp: any[] = []
            nodes_filtered.forEach( node=> {
                let item; 
                item = organs_affect_to_be_removed.find( d => d.id === node.id )
                if (item) {
                    //item removed
                } else {
                    tmp.push(node)
                }
            })
            nodes_filtered = tmp;
            // console.log('---->Debug: filterData nodes_filtered', nodes_filtered)

        
            tmp = []
            links_filtered.forEach( link => {
                let item; 
                // d3 change the data structure for link.source and target
                // console.log('---->Debug: link.target', link.target)
                let id = (typeof link.target === 'object')?link.target.id:link.target
                item = organs_affect_to_be_removed.find( node => node.id === id )
                if (item) {
                    //item removed
                } else {
                    tmp.push(link)
                }
            })

            links_filtered = tmp
            console.log('---->Debug: filterData gender=', currentGenderSelect)
            // console.log('---->Debug: filterData links_filtered', links_filtered)
        } else {
            nodes_filtered = [...data.nodes]
            links_filtered = [...data.links]
            console.log('---->Debug: filterData gender=both')
        }
    }

    const handleLabel = (node: Node) => {
        // console.log('debug: handleLabel ', data.label)
        if (node.group === 'Organ' && node.type ==='triangle'){
            return 'Organ*'
        } else {
            return node.group
        }    
    }


    const NodeProperties = () => {



        const GeneNodeProperties =() => {
            return (<>
                <p> {currentNode.group} ({currentNode.id})</p>
                <p> Name {currentNode.name}</p>
                <p> Full name{currentNode.fullName}</p>
                <p> Alternative names {currentNode.altName}</p>
            </>)
        }
        
        const OrganNodeProperties =() => {
            return (<>
                <p> {currentNode.group} ({currentNode.id})</p>
                <p> Name {currentNode.name}</p>
                <p> Gender {currentNode.gender}</p>
                <p> {currentNode.has_risk === true && 
                <>
                        <p> Risk {currentNode.risk}</p>
                        <p> Population Risk{currentNode.population_risk}</p>
                
                </> 
                }
                </p>
            </>)
        }

        return (<>
        <p> *Penetrance not available</p>
            {currentNode?currentNode.group==='Gene'?
                <GeneNodeProperties></GeneNodeProperties> : <p></p>
                :<p></p>
            }
            {currentNode?currentNode.group==='Organ'?
                <OrganNodeProperties></OrganNodeProperties> : <p></p>
            :<p></p>
            }
        </>)
    }

    filterData()


    return (<>
        {debug?<div>
            <select
                onChange={handleGeneChange}
            >
                <option>Please choose one option</option>
                {[gene].map((option:any, index) => {
                    return <option key={index} >
                        {option.id}
                    </option>
                })}
            </select>
            <select
                onChange={handleGenderChange}
            >
                <option >Please choose one option</option>
                <option key='male' value='male'>Male</option>
                <option key='female' value='female'>Female</option>
            </select>
        </div>:<></>}
        <div id='generiskgraph-container' 
            style={debug?{
                position: 'absolute',
                top: '10px',
                right: '10px',
                bottom: '10px',
                border: '3px solid #73AD21',
            }:{
                position: 'relative',
                border: '1px solid #73AD21',
            }
        }  
        >
            {/* <div 
                style={debug?{
                    display: 'inline-block',
                    width: '500px',
                    height: '535px',
                    border: '2px solid blue',
                }:{
                    display: 'inline-block',
                    width: '500px',
                    height: '535px',
                    border: '1px solid blue',
                }
            } */}
            {/* > */}
                <svg  
                    width={750}
                    height={500}
                    style={debug?{
                        border: '3px solid red',
                    }:{
                        border: '0px',
                    }
                }
                    id="graph-contrainer"
                    ref={ref}
                >
                </svg>
                <div 
                    id='graph-properties'
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        width: '250px',
                        border: '1px solid grey',
                        backgroundColor: 'rgba(220,220,220,0.9)'
                    }} 
                >
                    <NodeLegends data={{nodes: nodes_filtered, links:links_filtered}} onLabel={handleLabel}></NodeLegends>
                    <NodeProperties></NodeProperties>
                </div>
                <div 
                    style={{
                        textAlign: 'center'

                    }}
                >
                    <label htmlFor='graph-gender-select'>Gender</label>
                    <select id='graph-gender-select'
                        onChange={handleGenderChange}
                    >
                        {/* <option>Please choose one option</option> */}
                        <option key='male' value='male'>Male</option>
                        <option key='female' value='female'>Female</option>
                        <option key='both' value='both'>Both</option>
                    </select>
                </div>
            {/* </div> */}
        </div>
    </>)
}

