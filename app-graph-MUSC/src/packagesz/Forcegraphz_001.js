// Forked from GeneRiskGrzph_002
import * as d3 from "d3"


const MANY_BODY_STRENGTH = -30

export const buildForceGraph = (svg, nodes, links) => {
    console.log('---->Debug: GeneRiskGraph.buildGraph')

    const width = +svg.attr('width')
    //const height = +svg.attr('height')
    const height = 500

    const centerX = width/2;
    const centerY = height/2;

    console.log(centerX)
    console.log(centerY)

    // console.log('---->Debug width', svg.attr('width'))

    const forceNode = d3.forceManyBody()
        .strength(MANY_BODY_STRENGTH);

    const forceLink = d3.forceLink(links)
        .id(d => d.id)
        .strength(1) 
        .distance(d=> d.distance?d.distance:160);

    const forceCenter = d3.forceCenter(centerX, centerY);

    const simulation = d3.forceSimulation(nodes)
        .force("charge", forceNode)
        .force("link", forceLink)
        .force("center", forceCenter)
        .on('tick', ticked);

    const link = svg
        .append('g')
            .attr('stroke', 'rgb(153, 179, 202')
        .selectAll('line')
        .data(links)
        .join('line')

    const node = svg
        .append('g')
        .selectAll('.node')
        .data(nodes)
        .join('circle')
            .classed('node', true)
            .attr('fill', node => node.fill)
            .attr("r", node =>  node.size)
            .attr('stroke', node => node.stroke)
            .attr('stroke-width', 2)
        .on('click', click)
        .call(drag(simulation));

    const clipPath = svg.append('g')
        .selectAll('clipPath')
        .data(nodes.filter(d=>d.proportions.length > 0))
        .join('clipPath')
            .attr('id', (d,i)=> 'clip_' + i)
        .append('rect')
            .attr('height', node => {
                return node.size * node.proportions[0].value
            })
            .attr('width', node =>  node.size * 2)

    const clipNode = svg
        .append('g')
        .selectAll('#clipNode')
        .data(nodes.filter(d => (d.proportions > 0 )))
        .join('circle')
            .attr('id', 'clipNode')
            .attr('clip-path', (d,i)=> `url(#clip_${i})`)
            .attr('fill',  d => d.stroke)
            .attr('r', d =>  d.size)
        .on('click', click)
        .call(drag(simulation));
    
    const pie =  d3.pie()
        .sort(null)
        .value( d => d.value )

    const arc = d3.arc()
        .outerRadius(30)
        .innerRadius(0);

    // PieNode

    const pieNode = svg.selectAll(".pienode")
        .data(nodes.filter(d =>  d.type === 'circle-pie' &&  d.proportions.length > 0 ))
        .enter()
            .append('g')
            .attr("class", "pienode")

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
                        return d.x - d.size*1.15
                    } else {
                        return d.x + d.size*1.15
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
            });
        clipPath
            .attr('x', node => node.x-node.size)
            .attr('y', node => node.y-node.size)

        clipNode
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
        
        pieNode 
            // .attr('cx', d => d.x)
            // .attr('cy', d => d.y)
            .attr('x', d => d.x )
            .attr('y', d => d.y )
            .attr('transform', d =>  "translate(" + d.x + "," + d.y + ")")
                    
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
            .classed("fixed", false);
        delete d.fixed;
        simulation.alpha(1).restart();  
    }
}