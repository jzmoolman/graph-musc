// Forked from GeneRiskGrzph_002
import { LineWeight } from "@mui/icons-material"
import * as d3 from "d3"

const MANY_BODY_STRENGTH = -30

export const buildForceGraph = (svg, nodes, links, onmouseenter,
     onmouseleave,
     dcx, dcy) => {
    console.log('---->Debug Frocegraphz: buildForceGraph')

    const width = svg.style('width')
    const height = svg.style('height')
    console.log('---->Debug: width', width.slice(0,-2))
    console.log('---->Debug height', height.slice(0,-2))
    let centerX = Number(width.slice(0,-2))/2 + dcx;
    let centerY = Number(height.slice(0,-2))/2 + dcy;
    console.log('---->Debug centerX', centerX)
    console.log('---->Debug centerY', centerY)

    const forceNode = d3.forceManyBody()
        .strength(MANY_BODY_STRENGTH);

    const forceLink = d3.forceLink(links)
        .id(d => d.id)
        .strength(1) 
        .distance(d=> d.distance?d.distance:160);

    const forceCenter = d3.forceCenter(centerX, centerY);

    const simulation = d3.forceSimulation(nodes)
        .force('charge', forceNode)
        .force('link', forceLink)
        .force('center', forceCenter)
        .on('tick', ticked);

    const link_group = svg.select('#link-group').node()
        ?svg.select('#link-group')
        :svg.append('g')
            .attr('id','link-group')

    const link = link_group
        .selectAll('line')
        .remove()
        .data(links)
            .join('line')
            .attr('id','link')
            .attr('stroke', 'rgb(153, 179, 202')

    const circle_group = svg.select('#circle-group').node()
            ?svg.select('#circle-group')
            :svg.append('g')
                .attr('id','circle-group')

    const circle_node = circle_group
        .selectAll('.circle-node')
        .data(nodes.filter(d=>d.type === 'circle' || d.type === 'circle-fill'))
        .join('circle')
            .classed('circle-node', true)
            .attr('fill', node =>  node.fill)
            .attr('r', node =>  node.nodeSize)
            .attr('stroke', node => node.stroke)
            .attr('stroke-width', 2)
        .on('mouseenter', mouseenter)
        .on('mouseleave', mouseleave)
        .on('click', click)
        .call(drag(simulation));


    const circle_fill_group = svg.select('#cirlce-fill-group').node()
            ?svg.select('#cirlce-fill-group')
            :svg.append('g')
                .attr('id','cirlce-fill-group')


    const clip_path = circle_fill_group
        .selectAll('clipPath')
        .data(nodes.filter(d=>d.type === 'circle-fill' && d.proportions.length > 0))
        .join('clipPath')
            .attr('id', (d,i)=> 'clip_' + i)
        .append('rect')
            .attr('height', node => {
                console.log('---->Debug force-graph type', node.name)
                console.log('---->Debug force-graph %', node.proportions[0].value)
                return node.nodeSize * 2 * node.proportions[0].value
            })
            .attr('width', node =>  node.nodeSize * 2)

    const circle_fill_node = circle_fill_group
        .selectAll('.circle_fill_node')
        .data(nodes.filter(d => d.type === 'circle-fill' && d.proportions.length > 0))
        .join('circle')
            .classed('circle_fill_node', true)
            .attr('clip-path', (d,i)=> `url(#clip_${i})`)
            .attr('fill',  d => d.stroke)
            .attr('r', d =>  d.nodeSize)
        .on('click', click)
        .on('mouseenter', mouseenter)
        .on('mouseleave', mouseleave)
        .call(drag(simulation));

    // Triangle
    const triangle_group = svg.select('#triangle-group').node()
            ?svg.select('#triangle-group')
            :svg.append('g')
                .attr('id','triangle-group')

    const triangle_node = triangle_group
        .selectAll('.triangle-node')
        .data(nodes.filter(d=>d.type === 'triangle'))
        .join('polygon')
            .classed('triangle-node', true)
            .attr('fill', node =>  node.fill)
            .attr('stroke', node => node.stroke)
            .attr('stroke-width', 2)
        .on('click', click)
        .on('mouseenter', mouseenter)
        .on('mouseleave', mouseleave)
        .call(drag(simulation));

    // Triangle End

    // PieNode

    const pie =  d3.pie()
        .sort(null)
        .value( d => d.value )

    const arc = d3.arc()
        .outerRadius(30)
        .innerRadius(0);

    const pieNode = svg.selectAll(".pienode")
        .data(nodes.filter(d => d.type === 'circle-pie' && d.proportions.length > 0 ))
        .enter()
            .append('g')
                .classed('pienode', true)
        .on('mouseenter', mouseenter)
        .on('mouseleave', mouseleave)
        .on('click', click)
        .call(drag(simulation))

    pieNode.selectAll("path")
        .data( (d, i)  => { 
            return pie(d.proportions)
        })
        .enter()
            .append("svg:path")
                .attr("d", arc)
                .attr("fill", (d, i) => d.data.color)


    // Pie Node END

    const text = svg.append("g")
        .selectAll('text')
        .data(nodes)
        .join("text")
            .attr('alignment-baseline', 'middle') 
            .attr('pointer-events', 'none')
            .attr('fill', node=> node.stroke)
            .text(d=>d.name);

    function ticked () {
        link
            .attr('x1', d => {
                return d.source.x
            })
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        circle_node
            .attr('cx', d => {
                // needs to move out of here
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
                if (d.text_anchor === 'auto-start-end' ) {
                    if ( d.x > centerX) {
                        return 'end'
                    } else {
                        return 'start'
                    }
                } else {
                    return 'middle'
                }
            })
            .attr('x', (d) => {
                if (d.text_anchor === 'auto-start-end' ) {
                    if ( d.x > centerX) {
                        return d.x - d.fontSize*1.15
                    } else {
                        return d.x + d.fontSize*1.15
                    }
                } else {
                    return d.x
                }
            })
            .attr('y', (d) => {
                if (d.text_anchor === 'auto-start-end' ) {
                    return d.y 
                } else {
                    return d.y
                }
            })

        clip_path
            .attr('x', node => node.x-node.nodeSize)
            .attr('y', node => node.y-node.nodeSize)

        circle_fill_node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
        
        pieNode 
            // .attr('cx', d => d.x)
            // .attr('cy', d => d.y)
            .attr('x', d => d.x )
            .attr('y', d => d.y )
            .attr('transform', d =>  "translate(" + d.x + "," + d.y + ")")
                    
        triangle_node 
            // .attr('cx', d => d.x)
            // .attr('cy', d => d.y)
            .attr('points', d => `${d.nodeSize/2},0 0,${d.nodeSize} ${d.nodeSize},${d.nodeSize}`)
            .attr('transform', d =>  `translate( ${d.x - d.nodeSize/2} ,${d.y - d.nodeSize/2} )`)

        // svg.select('#hover-box')
        //     .attr('x', 20)
        //     .attr('y', 20)
    }
    
    function drag(simulation)  {
        function dragstarted(event, d) {

            d3.select(this)
                .classed('fixed', true)
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
        d3.select(this)
            .classed('fixed', false);
        delete d.fixed;
        simulation.alpha(1).restart();  
    }
    
    function mousehover(event, d) {
        console.log('---->Debug Frocegraphz: mouse hover')
    }
    
    function mouseenter(event, d) {
        console.log('---->Debug Frocegraphz: Forcegraphz mouse enter')
        if (onmouseenter) {
            onmouseenter(d)
        }
    }
    
    function mouseleave(event, d) {
        console.log('---->Debug Frocegraphz: Forcegraphz mouse leave')
        if (onmouseleave) {
            onmouseleave(d)
        }
    }
}