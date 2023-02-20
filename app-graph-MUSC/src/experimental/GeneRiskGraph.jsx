// Forked from: ForceGraphFill.jsx

import { useEffect, useRef } from "react"
import * as d3 from "d3"

import './ForceGraph.css'

const  MANY_BODY_STRENGTH = -30;

export const GeneRiskGraph = ({ nodes, links}) => {
    const ref = useRef(null);
    const genes = nodes.filter(d=>d.type === 'gene')

                
    let currentSelect = null

    useEffect(()=>{
        buildGraph();
    },[])

    const buildGraph = () => {
        if (!currentSelect) return 
        
        function intern(value) {
            return value !== null && typeof value === "object" ? value.valueOf() : value;
        }

        let filterNodes = nodes.filter( node => node.id === currentSelect )
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

            if ( source === currentSelect ) {
                let tmp = nodes.find(node => {
                    return node.id === target
                })
                filterNodes.push(tmp)
                return true;

            } else return false
        })

        const svg = d3.select(ref.current);
    
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const centerX = width/2;
        const centerY = height/2;

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
            scale
            |------|------|------|
            0      r/2    R      s*r/2      | where s is scaleFactor, in this case is 1
                   min Scale     Max scale
        */

        const scaleFactor = 1

        function scaleRadius(r,s,p)  {
            return r/2 + s*r*p;
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
                        return scaleRadius(node.size, scaleFactor, +node.male_risk/100)
                    } else {
                        return node.size;
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
                            let p = +node.male_risk/100
                            r = scaleRadius(node.size, scaleFactor, p) // r is radius of scaled circle, and the height is 2r
                                                                          // however we want to fill on % of the clipNode, therefore.
                            if (+node.male_risk === 0) {
                                height = 0; // clip nothing, think how we can present this?
                            } else {
                                let ratio = +node.male_populationRisk/+node.male_risk
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
                            let p = +node.male_risk/100
                            r = scaleRadius(node.size, scaleFactor, p) // r is radius of scaled circle, and the width is 2r
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
                .attr('alignment-baseline', 'middle')
            .selectAll('text')
            .data(filterNodes)
            .join("text")
                .attr('pointer-events', 'none')
                .text(d=>d.id);
        
        

        console.log('----->', '5')

        function ticked () {
            link
                .attr('x1', d => {
                    return d.source.x
                })
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
            text
                .attr('text-anchor', (d) => { 
                    return d.type === 'gene'?'middle':'start'
                })
                .attr('x', (d) => {
                    return d.type === 'gene'? d.x : d.x - d.dx
                })
                .attr('y', (d) => {return d.y});
            clipPath
                .attr('x', node => node.x + node.dx )
                .attr('y', node => node.y + node.dy )
            clipNode
                .attr('r', node=> { 
                    let r; 
                    if (node.type === 'cancer' ) {
                        r  = scaleRadius(node.size, scaleFactor,+node.male_risk/100)
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
                event.subject.fx = event.x;
                event.subject.fy = event.y;
                simulation.alpha(1).restart();
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

    function handleChange(e) {
        currentSelect = e.target.value
        d3.select(ref.current)
            .selectAll('*')
            .remove()

        buildGraph()
    }
        
    return (<>
        // debugging purpose to select a single gene
        <div>
            <select
                onChange={handleChange}
            >
                <option>Please choose one option</option>
                {genes.map((option, index) => {
                    return <option key={index} >
                        {option.id}
                    </option>
                })}
            </select>
        </div>

        // svg -

        <svg id="graph-contrainer" width={500}  height={500} ref={ref}>
        </svg>
    </>)
}

