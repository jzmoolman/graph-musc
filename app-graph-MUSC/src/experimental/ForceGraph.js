import { useEffect, useRef } from "react"
import * as d3 from "d3"

import './ForceGraph.css'

const  MANY_BODY_STRENGTH = -30;

export const ForceGraph = ({ nodes, links}) => {
    const ref = useRef(null);
    useEffect(()=>{
        buildGraph();
    },[])

    const buildGraph = () => {
        // let _nodes = [...nodes];
        // let _links = [...links];

        // const N = d3.map(nodes, d=>d.id).map(intern);
        // const LS = d3.map(links, d=>d.source).map(intern);
        // const LT = d3.map(links, d=>d.target).map(intern);

        // nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
        // links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));
      
        function intern(value) {
            return value !== null && typeof value === "object" ? value.valueOf() : value;
        }

        const svg = d3.select(ref.current);
        const messageContrainer = d3
            .select('#messageContrainer');
    
        const width = +svg.attr('width');
        const height = +svg.attr('height');
        const centerX = width/2;
        const centerY = height/2;
        // svg.attr("viewBox", [0, 0, width, height]);
    

        const forceNode = d3.forceManyBody()
            .strength(MANY_BODY_STRENGTH);

        const forceLink = d3.forceLink(links)
            .id(d => d.id)
            .strength(1) 
            .distance(d=>d.distance);
        const forceCenter = d3.forceCenter(centerX, centerY);

        const simulation = d3.forceSimulation(nodes)
            .force("charge", forceNode)
            .force("link", forceLink)
            .force("center", forceCenter)
            .on('tick', ticked);

        const link = svg.append('g')
                .attr('stroke', 'black')
            .selectAll('line')
            .data(links)
            .join('line')

        const pie = d3.pie()
            .sort(null)
            .value( d => d.value)

        const arc = d3.arc()
            .outerRadius(30)
            .innerRadius(0);
             
        const node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
                .classed('node', true)
                .attr("fill", d => d.color)
                .attr("r", d=>d.size)
                .on('click', click)
                .call(drag(simulation));

        node.selectAll('path')
            .data((d,i)=> { 
                console.log(d)
                return pie(d.proportions)}
            )
            .enter().append('svg:path')
               .attr('d', arc)
               .attr('fill', (d,i) => {return d.data.group == 1? 'purple': 'yellow'})
                

        const text = svg.append("g")
                // .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .style('pointer-events', 'none')
            .selectAll('text')
            .data(nodes)
            .join("text")
                .text(d=>d.id);

        function ticked () {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"}); ;
            text
                .attr('text-anchor', (d) => { 
                    return d.type ==='gene'? 'middle':'end'
                })
                .attr('x', (d) => {return d.x})
                .attr('y', (d) => {return d.y});
                        
        }
       
        function drag(simulation)  {
            function dragstarted(event) {

                d3.select(this).classed('fixed', true)

                console.log('dragstart', d3.select(this).classed)
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
            simulation.alpha(1).restart();  
        }
    }

        
    return (<>
        <div id="messageContrainer" height="32px"></div>
        <svg id="graph-contrainer" width={960}  height={960} ref={ref}>
        </svg>
    </>)
}

