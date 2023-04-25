// import { GraphData } from "react-force-graph-2d";
// import { Node } from "../data/gene-organ.forcegraph";

export const build_legends =( svg, data, onLabel) => {
    
    console.log('---->Debug: build_legends, data', data.nodes)


    let nodeTypes = []
    let legendNodes = []
    data.nodes.forEach(node=> {
        let index = nodeTypes.findIndex((nodeType)=> {
            if ( nodeType.type === node.type && nodeType.group === node.group) {
                return true
            } else {
                return false
            }

        })
        if (index === -1) {
            nodeTypes.push({
                type: node.type,
                group: node.group
            })
            legendNodes.push(node)
            
        }

    })
    console.log('---->Debug: build_legends, nodeTypes', nodeTypes)
    
    const node_size = 30
    const stroke_width = 2
    let index = -1
    console.log(legendNodes.length)
    let width = (node_size*1.5+stroke_width)*2*legendNodes.length
    let height = (node_size+stroke_width)*2 + 5 + 16
    svg.attr('viewBox',`0 0 ${width},${height}`)
    svg.attr('width',width/2)
    svg.attr('height',height/2)


  
    const legend_group = svg.select('#legend-group').node()
        ?svg.select('#legend-group')
        :svg.append('g')
        .attr('id','legend-group')



    const legend_node = legend_group
        .selectAll('.legend-node')
        .data(legendNodes.filter(d=>d.type === 'circle' || d.type === 'circle-fill'))
        .join('circle')
            .classed('legend-node', true)
            .attr('fill', node =>  node.fill)
            .attr('r', node =>  node_size) 
            .attr('stroke', node => node.stroke)
            .attr('stroke-width', stroke_width)
            .attr('cx', node => { 
                index += 1
                let offset = node_size+stroke_width
                console.log('index', index)
                node.cx = offset + ((node_size*1.5+stroke_width)*2*index)
                console.log(node.cx)
                return node.cx
            })
            .attr('cy', node=>{
                node.cy = node_size + stroke_width
                return  node.cy
             })

    // Triangle
    const triangle_group = svg.select('#triagle-group').node()
        ?svg.select('#triagle-group')
        :svg.append('g')
            .attr('id','triangle-group')

    const triangle_node = triangle_group
        .selectAll('.triangle-node')
        .data(legendNodes.filter(d=>d.type === 'triangle'))
        .join('polygon')
            .classed('triangle-node', true)
            .attr('fill', node =>  node.fill)
            .attr('stroke', node => node.stroke)
        .attr('stroke-width', stroke_width)

        .attr('points', d => `${node_size+stroke_width},${stroke_width} ${stroke_width},${node_size*2} ${node_size*2},${node_size*2}`)
        .attr('transform', node=> {
            index += 1
            let offset = stroke_width
            node.x = offset + ((node_size*1.5+stroke_width)*2*index) 

            return `translate( ${node.x},0)`
        }) 

    const text = svg.append("g")
        .selectAll('text')
        .data(legendNodes)
        .join("text")
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle') 
            .attr('pointer-events', 'none')
            .attr('fill', node=> node.stroke)
            .text( node => {
                if (onLabel) {
                    // let data = {label: 'test'}
                    // console.log('---->Debug: before onLabel')
                    return onLabel(node) 
                    // console.log('---->Debug: after onLabel')
                } else {
                    return node.group
                }
            })
            .attr('x', node=> {
                console.log('---->Debug: node', node)
                if (node.type === 'circle' || node.type === 'circle-fill') {
                    return node.cx
                } else {
                    return node.x + node_size
                }
            })
            .attr('y', (node_size+stroke_width)*2+10)

  }
