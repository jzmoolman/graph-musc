// Forked from: ForceGraphFill.jsx

import { useEffect, useRef } from "react"
import * as d3 from "d3"

import './ForceGraph.css'
import { width } from "@mui/system";

const DEBUG = false
const MANY_BODY_STRENGTH = -30;

export const GeneRiskGraph = ({ nodes, links, gene, gender, debug=DEBUG}) => {
    const ref = useRef(null);
    const genes = nodes.filter(d=>d.type === 'gene')

                
    let currentGeneSelect = gene
    let currentGenderSelect = gender


    useEffect( ()=>   {
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph();

    }, [currentGenderSelect, currentGeneSelect])
    
    const buildGraph = () => {
        
        console.log('---->buildGraph.gene', gene)
        console.log('---->buildGraph.gender', gender)

        if (!currentGeneSelect || !currentGenderSelect)  return 

        console.log('---->buildGraph ok')


        let filterNodes = nodes.filter( node => node.id === currentGeneSelect )
        if (filterNodes.length !== 1 ) {
            console.log('Nodes data invalid')
        }

        // filterNodes can ony have one node at thit point 
        let filterLinks = links.filter( link => {
            let source
            let target
            if (typeof link.source === 'object') {
                source = link.source.id
            } else {
                source = link.source
            }

            if (typeof link.target === 'object') {
                target = link.target.id
            } else {
                target = link.target
            }

            if ( source === currentGeneSelect ) {
                let cancerNode = nodes.find(node => {
                    return node.id === target
                })

                if ( currentGenderSelect === 'male') {
                    cancerNode.risk = (d) => {
                        return +d.male_risk
                    }
                    cancerNode.populationRisk = (d) => {
                        return +d.male_populationRisk
                    }
                    if ( +cancerNode.male_populationRisk !== 0) {
                        filterNodes.push(cancerNode)
                        return true
                    } else {
                        return false
                    }
                } else if ( currentGenderSelect === 'female') {
                    cancerNode.risk = (d) => {
                        return +d.female_risk
                    }
                    cancerNode.populationRisk = (d) => {
                        return +d.female_populationRisk
                    }
                    if ( +cancerNode.female_populationRisk !== 0) {
                        filterNodes.push(cancerNode)
                        return true
                    } else {
                        return false
                    }
                } else {
                    // Data invalid format: gender option 1 -> male
                    //                      gender option 2 -> female
                }
                return false;

            } else return false
        })

        console.log('---->Debug: filterNodes', filterNodes)

        const svg = d3.select(ref.current)
        console.log('---->Debug: svg', svg)
        console.log('---->Debug: 1')
    
        const width = +svg.attr('width')
        console.log('---->Debug: 2')
        console.log('width', width)
       
        console.log('---->Debug: 3')
        const height = 500//+svg.attr('height')

        console.log('---->Debug: 4')
        console.log('height', height)
      
        const centerX = width/2;
        const centerY = height/2;

        console.log(centerX)
        console.log(centerY)

        console.log('---->Debug width', svg.attr('width'))

        const forceNode = d3.forceManyBody()
            .strength(MANY_BODY_STRENGTH);

        const forceLink = d3.forceLink(filterLinks)
            .id(d => d.id)
            .strength(1) 
            .distance(d=> d.distance?d.distance:160);

        const forceCenter = d3.forceCenter(centerX, centerY);

        const simulation = d3.forceSimulation(filterNodes)
            .force("charge", forceNode)
            .force("link", forceLink)
            .force("center", forceCenter)
            .on('tick', ticked);

        const link = svg.append('g')
                .attr('stroke', 'black')
            .selectAll('line')
            .data(filterLinks)
            .join('line')
        
        /*
            scale - scaleRadius
            |------|------|------|
            0      r/2    R      s*r/2      | where s is scaleFactor, in this case is 1
                   min Scale     Max scale

                   Replace with new method 
        */

        // function scaleRadius(r,s,p)  {
        //     return r/2 + s*r*p;
        // }
        
        // function scaleRadiusv2(r,p)  {
        //     return Math.sqrt((1+p)*r*r);
        // }
        
        /* 
            r = max radius
            p | where between 0 and 1 and represent the % of scale applied to r
        */
        function scaleRadiusv3(r, p) {
            const DEAULT_AREA = Math.PI*Math.pow(r,2)
            return r*.20 + Math.sqrt(DEAULT_AREA*p/Math.PI)  // min(r) = r*0.1
        }


        const node = svg.append('g')
           .selectAll('#node')
           .data(filterNodes)
           .join('circle')
                .classed('node', true)
                .attr('id', 'node')
                .attr("fill", node => node.color)
                .attr("r", node => {
                    if ( node.type === 'cancer') {
                        const newR = scaleRadiusv3(node.size, +node.risk(node)/100)
                        console.log('------>circle.node', node, newR)
                        return newR;                  
                    } else {
                        return node.size
                    }
                })
                .attr('stoke', node => node.color)
            .on('click', click)
            .call(drag(simulation));

        const clipPath = svg.append('g')
                .selectAll('clipPath')
                .data(filterNodes)
                .join('clipPath')
                    .attr('id', (d,i)=> 'clip_' + i)
                .append('rect')
                    .attr('height', node => {
                        let height;
                        let r;

                        if ( node.type ==='cancer') {
                            let p = +node.risk(node)/100
                            r = scaleRadiusv3(node.size, p) // r is radius of scaled circle, and the height is 2r
                                                                          // however we want to fill on % of the clipNode, therefore.
                            if (+node.risk(node) === 0) {
                                height = 0; // clip nothing, think how we can present this?
                            } else {
                                let ratio = +node.populationRisk(node)/+node.risk(node)
                                height = 2*r - 2*r*ratio
                            }
                        } else {
                            r = node.size
                            height =  0; // Clip Nothing
                        }
                        node.dy = -r
                        return height
                    })
                    .attr('width', node=> {
                        let r;
                        if ( node.type ==='cancer' ) {
                            let p = +node.risk(node)/100
                            r = scaleRadiusv3(node.size, p) // r is radius of scaled circle, and the width is 2r
                        } else {
                            r = node.size
                        }
                        node.dx = -r
                        return 2*r
                    })

        const clipNode = svg.selectAll('#clipNode')
            .data(filterNodes)
            .join('circle')
                .attr('id', 'clipNodes')
                .attr('clip-path', (d,i)=> `url(#clip_${i})`)
                // Clip color
                .attr('fill', d=>{ 
                    return d.clipColor
                })
            .on('click', click)
            .call(drag(simulation));

        const text = svg.append("g")
            .selectAll('text')
            .data(filterNodes)
            .join("text")
                .attr('alignment-baseline', 'middle') 
                .attr('pointer-events', 'none')
                .text(d=>d.name);

        function ticked () {
            link
                .attr('x1', d => {
                    return d.source.x
                })
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => {
                    if (d.type === 'gene') {
                        d.fx = centerX
                    }
                    return d.x
                })
                .attr('cy', d => {
                    if (d.type === 'gene') {
                        d.fy = centerY
                    }
                    return d.y
                }
                )
            text
                .attr('text-anchor', (d) => {
                    if (d.type === 'gene' ) {
                        return 'middle'

                    } else {
                        if ( d.x > centerX) {
                            return 'start'

                        } else {
                            return 'end'

                        }
                    }
                })
                .attr('x', (d) => {
                    if (d.type === 'gene' ) {
                        return centerX
                    } else {
                        if ( d.x > centerX) {
                            return d.x - d.dx
                        } else {
                            return d.x + d.dx

                        }
                    }
                })
                .attr('y', (d) => {
                    if (d.type === 'gene' ) {
                        return centerY
                    } else {
                        return d.y 
                    }
                });
            clipPath
                .attr('x', node => node.x + node.dx )
                .attr('y', node => node.y + node.dy )
            clipNode
                .attr('r', node=> { 
                    let r; 
                    if (node.type === 'cancer' ) {
                        r  = scaleRadiusv3(node.size, +node.risk(node)/100)
                    } else {
                        r = node.size
                    } 

                    if ( node.fixed) {
                        return r-(r*0.05)
                    } else {
                        return r-(r*0.025)
                    }
                })
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                        
        }
       
        function drag(simulation)  {
            function dragstarted(event, d) {

                d3.select(this).classed('fixed', true)
                d.fixed = true;
                


                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                if (event.subject.type === 'gene') {
 
                } else {
                    event.subject.fx = event.x;
                    event.subject.fy = event.y;
                    simulation.alpha(1).restart();
                }
            }

            function dragend(event) {
                if (!event.active) simulation.alphaTarget(0);
                // event.subject.fx = null
                // event.subject.fy = null
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragend)
        }

        function click(event, d) {
            delete d.fx;
            delete d.fy;
            d3.select(this).classed("fixed", false);
            delete d.fixed;
            simulation.alpha(1).restart();  
        }
    }

        
    function handleGeneChange(e) {
        currentGeneSelect = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph()
    }
    
    function handleGenderChange(e) {
        currentGenderSelect = e.target.value
        console.log(e.target.value)
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph()
    }

    return (<>
        {debug?<div>
            <select
                onChange={handleGeneChange}
            >
                <option>Please choose one option</option>
                {genes.map((option, index) => {
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
        <div 
            style={debug?{
                position: 'absolute',
                top: '40px',
                right: '10px',
                bottom: '10px',
                left: '10px',
                border: '3px solid #73AD21',
            }:{
                display: 'inline-block',
                border: '1px solid #73AD21',
            }
        }  
        >
            <div 
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
            }
            >
                <svg  
                    width={500}
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
                    </select>
                </div>
            </div>
        </div>
    </>)
}

