// Forked from: GeneRiskGraph__03.jsx
// Changed to TSX

import { useEffect, useRef , useState} from "react"
import * as d3 from "d3"

import './ForceGraph.css'
import { buildForceGraph } from "../packagesz/forcegraphz"
import { GraphData, NodeObject } from "react-force-graph-2d"
// import { Gene_OrganRisks } from "../data/neo4j/gene-_-organ.neo4j"
import { Node, OrganGenderNode, OrganPenetranceNode } from '../data/forcegraph/types.forcegraph'
import { NodeLegends } from "./NodeLegends"
const DEBUG = false


type GeneRiskGraphProps = {
    data :GraphData,
    // gene?: Gene_OrganRisks,
    gender: string,
    debug?: boolean,
}

export const GeneRiskGraph = ({ 
        data,
        gender,  // default gender
        debug=DEBUG,
    }: GeneRiskGraphProps) => {
    console.log("---->Debug: GeneRiskGraph")
    console.log("---->Debug: GeneRiskGraph gender", gender)

    const ref = useRef(null);
    let node 
    let dataFiltered : GraphData
    const [currentNode, setCurrentNode] = useState<any>(node)

    let currentGender = gender

    useEffect( ()=>   {
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph();

    }, [])

    const handleMouseEnter = (d:any)  => {
        console.log('---->Debug: GeneRiskGraph handlemouseenter', d)
        setCurrentNode(d)
    }
    
    const handleMouseLeave = (d:any)  => {
        console.log('---->Debug: GeneRiskGraph handlemouseleave', d)
        setCurrentNode(null)
    }
    
    function handleGenderChange(e:any) {
        currentGender = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        console.log('---->Debug: GeneRiskGraph handleGenderChange', currentGender)
        dataFiltered = filterGender(currentGender, data)
        buildGraph()
    }
    
    const buildGraph = () => {
        // console.log('---->Debug: GeneRiskGraph.buildGraph')

        const svg = d3.select(ref.current)
        const cx = +svg.attr('width')/3
        const cy = +svg.attr('height')/2

        // console.log('---->Debug: svg', svg)
        buildForceGraph(svg, dataFiltered.nodes, dataFiltered.links, handleMouseEnter, handleMouseLeave,cx,cy )
    }

    const handleLabel = (node: Node) => {
        // console.log('debug: handleLabel ', data.label)
        if (node.group === 'Organ') {
            return 'No Penetrance'
        
        } if (node.group === 'OrganPenetrance') {
            return 'Organ' 
        } else {
            console.log('---->Debug: node.group', node.group)
            return node.group
        }    
    }

    const NodeProperties = () => {

        console.log('--->Debug: GeneRiskGraph CurrentNode', currentNode)

        const GeneNodeProperties =() => {
            return (<>
                {/* <p> {currentNode.group} ({currentNode.id})</p> */}
                <p>  {currentNode.group} {currentNode.name}</p>
                <p> Full name {currentNode.fullName}</p>
                <p> Alternative names {currentNode.altName}</p>
            </>)
        }
        
        const OrganNodeProperties =() => {
            return (<>
                {/* <p> {currentNode.group} ({currentNode.id})</p> */}
                <p>  {currentNode.group} {currentNode.name}</p>
                <p> Gender {currentNode.gender}</p>
            </>)
        }
        
        const OrganPentranceNodeProperties =() => {
            return (<>
                {/* <p> {currentNode.group} ({currentNode.id})</p> */}
                <p>Organ {currentNode.name}</p>
                <p>Gender {currentNode.penetrance.gender}</p>
                <p>Penetrance {currentNode.penetrance.risk}%</p>
                <p>Population Penetrance {currentNode.penetrance.population_risk}%</p>
            </>)
        }

        return (<>
            {currentNode?currentNode.group==='Gene'?
                <GeneNodeProperties></GeneNodeProperties> : <p></p>
                :<p></p>
            }
            {currentNode?currentNode.group==='Organ'?
                <OrganNodeProperties></OrganNodeProperties> : <p></p>
            :<p></p>
            }
            {currentNode?currentNode.group==='OrganPenetrance'?
                <OrganPentranceNodeProperties></OrganPentranceNodeProperties> : <p></p>
            :<p></p>
            }
        </>)
    }

    const filterGender = (gender: string, data: GraphData): GraphData => {
        let filterNodes : NodeObject[] = []

        console.log('---->Debug: GeneCard filterGender data', data)
        let not_gender = ''
        if (gender === 'Male') {
            not_gender = 'Female'
        } else {
            not_gender = 'Male'
        }

        data.nodes.forEach(d => {
            if ((d as Node).group === 'OrganPenetrance'  ) {
                if ((d as OrganPenetranceNode).penetrance.gender === not_gender ) { 
                    filterNodes.push(d)
                }
            } else if ((d as Node).group === 'Organ') {
                if ((d as OrganGenderNode).gender === not_gender ) { 
                    filterNodes.push(d)
                }
            }
        })

        console.log('---->Debug: GeneCard filterGender filterNodes gender', gender)
        console.log('---->Debug: GeneCard filterGender filterNodes filterNodes', filterNodes)
        
        let result: GraphData = {
            nodes : data.nodes.filter( data => !filterNodes.includes(data)),
            links : data.links.filter( data => {
                
                if (filterNodes.findIndex( searchElement => { 
                    let id = typeof data.target === 'object'? data.target.id: data.target
                    return (searchElement as Node).id === id
                }) === -1) { 
                    return true
                } else {
                    return false
                }
            }) 
        }
        console.log('---->Debug: GeneCard filterCauseWhenPenetrance result', result)

        return result

    }
    
    dataFiltered = filterGender(gender, data)

    return (<>
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
                <NodeLegends data={dataFiltered} onLabel={handleLabel}></NodeLegends>
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
                    <option key='male' value='Male'>Male</option>
                    <option key='female' value='Female'>Female</option>
                </select>
            </div>
        </div>
    </>)
}

