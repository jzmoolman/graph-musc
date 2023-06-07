// Forked from: GeneRiskGraph__03.jsx
// Changed to TSX

import { useEffect, useRef , useState} from "react"
import * as d3 from "d3"

import './ForceGraph.css'
import { buildForceGraph } from "../packagesz/forcegraphz"
import { GraphData, NodeObject } from "react-force-graph-2d"
// import { Gene_OrganRisks } from "../data/neo4j/gene-_-organ.neo4j"
import { GeneNode, Node,  OrganAffectNode,  OrganPenetranceNode } from '../data/forcegraph/types.forcegraph'
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
    console.log("---->Debug: data", data)
    // console.log("---->Debug: GeneRiskGraph gender", gender)

    const ref = useRef(null);
    let node 
    let dataFiltered : GraphData = { nodes: [], links: []}
    const [currentNode, setCurrentNode] = useState<any>(node)

    let currentGender = gender
    let diseaseType = 'Both'
    let noPenetranceGroup = 'Group'

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

    function filterData() {
        dataFiltered = filterAffectWhenPenetrance(data)
        dataFiltered = filterGender(currentGender, dataFiltered)
        dataFiltered = filterDiseaseType(diseaseType, dataFiltered)
        dataFiltered = groupNoPenetrance(noPenetranceGroup, dataFiltered)
    }
    
    function handleGenderChange(e:any) {
        // console.log('---->Debug: GeneRiskGraph handleGenderChange', currentGender)
        currentGender = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph()
    }
   
    function handleDiseasetypeChange(e:any) {
        // console.log('---->Debug: GeneRiskGraph handleDiseasetypeChange', currentGender)
        diseaseType = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph()

    }
    
    function handleNoPenetranceChange(e:any) {
        console.log('---->Debug: GeneRiskGraph handleNoPenetranceChange', noPenetranceGroup)
        noPenetranceGroup = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph()
    }
    
    const buildGraph = () => {
        // console.log('---->Debug: GeneRiskGraph.buildGraph')
        const svg = d3.select(ref.current)
        const cx = +svg.attr('width')/3
        const cy = +svg.attr('height')/2

        // console.log('---->Debug: svg', svg)
        // buildForceGraph(svg, dataFiltered.nodes, dataFiltered.links, handleMouseEnter, handleMouseLeave,cx,cy )
        filterData()
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
            const organ = currentNode as OrganAffectNode
            return (<>
                {/* <p> {currentNode.group} ({currentNode.id})</p> */}
                <p>{currentNode.group} {organ.name}</p>
                <p>Gender {organ.affect.gender}</p>
                <p>Disease  {organ.affect.diseaseName}</p>
                <p>Type   {organ.affect.diseaseType}</p>
                <p>Predominant disease   {organ.affect.predominantCancerSubType}</p>

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
            {currentNode?currentNode.group==='OrganAffect'?
                <OrganNodeProperties></OrganNodeProperties> : <p></p>
            :<p></p>
            }
            {currentNode?currentNode.group==='OrganPenetrance'?
                <OrganPentranceNodeProperties></OrganPentranceNodeProperties> : <p></p>
            :<p></p>
            }
        </>)
    }
    
    const filterAffectWhenPenetrance = (data: GraphData): GraphData => {
        let filterNodes : NodeObject[] = []

        console.log('---->Debug: GeneCard filterAffectWhenPenetrance data', data)

        data.nodes.forEach(d => {
            if((d as Node).group === 'OrganAffect') {
                // Filter Affect-Organ if Penetetrance-organ exists 
                let node = data.nodes.find(node => {
                    if ((node as Node).group === 'OrganPenetrance' && (node as OrganPenetranceNode).original_id === (d as OrganPenetranceNode).original_id ) {
                        return true
                    } else {
                        return false
                    }
                }) 
                if (node) {
                    filterNodes.push(d)
                }
            }
        })
        console.log('---->Debug: GeneCard filterCauseWhenPenetrance filterNodes', filterNodes)
        
        let result: GraphData = {
            nodes : data.nodes.filter( data => !filterNodes.includes(data)),
            links : data.links.filter( data => {
                
                if (filterNodes.findIndex( searchElement => { 
                    // make commit
                    // the target property of links can be eiter string(id) or object that contains the id
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

    const filterDiseaseType = (diseaseType: string, data: GraphData): GraphData => {
        let filterNodes : NodeObject[] = []

        // console.log('---->Debug: GeneCard filterDiseaseType data', data)
        let not_diseaseType = ''
        if (diseaseType === 'Both') {
            return data
        } if ( diseaseType ==='Cancer') { 
            not_diseaseType = 'Beneign'
        } if ( diseaseType === 'Beneign') {
            not_diseaseType = 'Cancer'
        }

        data.nodes.forEach(d => {
            if ((d as Node).group === 'OrganAffect'  ) {
                if ((d as OrganAffectNode).affect.diseaseType === not_diseaseType ) { 
                    filterNodes.push(d)
                }
            }
            // Is all OrganPenetrance dieaseType Cancer
        })
        
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
        // console.log('---->Debug: GeneCard filterCauseWhenPenetrance result', result)

        return result

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
            // } else if ((d as Node).group === 'OrganAccept') {
            } else if ((d as Node).group === 'OrganAffect') {
                if ((d as OrganAffectNode).affect.gender === not_gender ) { 
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
        console.log('---->Debug: GeneCard filterGender result', result)

        return result

    }

    const groupNoPenetrance = (value:string, data: GraphData) => {

        console.log('---->Debug: GeneCard groupNoPenetrance ')
        let result: GraphData = {
            nodes: data.nodes,
            links: data.links,
        }
        if ( value === 'Group') {

            let groupNodes : NodeObject[] = []
            let filterNodes: NodeObject[] = []
            let gene: GeneNode
            
            data.nodes.forEach(node => {
                if ((node as Node).group === 'Gene') {
                    //The data should only contain one gene
                    gene = node as GeneNode
                } else if ((node as Node).group === 'OrganAffect') {
                    console.log('---->Debug: GeneCard for each node ', (node as OrganAffectNode).group)
                    let organAffectNode : OrganAffectNode = {
                        ...node as OrganAffectNode,
                        affect : {
                            type: (node as OrganAffectNode).affect.type,
                            id: 'Grouped',
                            gender: 'Grouped',
                            finalVerdict: (node as OrganAffectNode).affect.finalVerdict,
                            diseaseName : 'Grouped',
                            diseaseType : 'Grouped',
                            predominantCancerSubType : 'Grouped',
                        }
                    }

                    if (groupNodes.findIndex(d=> (d as OrganAffectNode).name === (node as OrganAffectNode).name) === -1) {
                        console.log('---->Debug: GeneCard Create Group ', (node as OrganAffectNode).name)
                        groupNodes.push(organAffectNode)

                    }
                    // filter all node if group is OrganAffect
                    filterNodes.push(node)
                    //return only one node
                }
            })
            console.log('---->Debug: GeneCard Group NoPenetrance  GroupNodes', groupNodes)

            // Filter all No Pentrance Organs
            result = {
                nodes: data.nodes.filter( node => !filterNodes.includes(node)),
                links: data.links.filter( data => {

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
            // Add groups back
            groupNodes.forEach(node => {
                result.nodes.push(node)
                result.links.push ({source: gene.id, target:node.id })
            })


        }
        return result 
    }
    
    // dataFiltered = filterGender(gender, data)
    // dataFiltered = filterDiseaseType(diseaseType, dataFiltered)
    // dataFiltered = groupNoPenetrance(noPenetranceGroup, dataFiltered)

    return (<>
        <div id='GeneRiskGraph-Container' 
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
                width={'auto'}
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
            <div id='GeneRiskGraph-Notes' 
                style={{
                    textAlign: 'center'

                }}
            >
                {/* Filter gender */}
                <label htmlFor='graph-gender-select'>Gender</label>
                <select id='graph-gender-select'
                    onChange={handleGenderChange}
                >
                    {/* <option>Please choose one option</option> */}
                    <option key='male' value='Male'>Male</option>
                    <option key='female' value='Female'>Female</option>
                </select>
                {/* Disease Type  */}
                <label htmlFor='graph-diseasetype-select'>Disease Type</label>
                <select id='graph-diseasetype-select'
                    onChange={handleDiseasetypeChange}
                >
                    {/* <option>Please choose one option</option> */}
                    <option key='Both' value='Both'>Both</option>
                    <option key='Cancer' value='Cancer'>Cancer</option>
                    <option key='Benign' value='Benign'>Benign</option>
 "
                </select>

                {/* Group by Organ iff organ is OrganAffect aka as no penetrance  */}
                <label htmlFor='graph-nopenetrance-select'>No Penetrance</label>
                <select id='graph-nopenetrane-select'
                    onChange={handleNoPenetranceChange}
                >
                    {/* <option>Please choose one option</option> */}
                    <option key='Group' value='Group'>Group</option>
                    <option key='No Group' value='No Group'>No Group</option>
                </select>
            </div>
        </div>
    </>)
}

