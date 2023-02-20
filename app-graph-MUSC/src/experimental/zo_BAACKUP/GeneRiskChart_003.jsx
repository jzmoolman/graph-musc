import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { axisTop } from "d3";
import { height } from "@mui/system";
import { Sledding } from "@mui/icons-material";


export function GeneRiskChart({data}) {
        const ref = useRef(null);

    let currentSelect = null

        useEffect( ()=>   {
            buildGraph();
        }, [])

    function buildGraph({
        marginTop = 30, // the top margin, in pixels
        marginRight = 10, // the right margin, in pixels
        marginBottom = 30, // the bottom margin, in pixels
        marginLeft = 60, // the left margin, in pixels
        width = 740, // the outer width of the chart, in pixel
        height = 600, // the outer height of the chart, in pixels

    } = {}) {
        // Prepare data for Graph
        if (!currentSelect) return
        const gene = data.find( d => d.id === currentSelect )
        console.log('data)', data)

        const x = d3.scaleLinear()
            .domain([0,100])
            .range([marginLeft, width-marginRight])
            .interpolate(d3.interpolateRound)

        const y = d3.scaleBand()
            .domain(gene.cancers.map( d=> d.id))
            .range([marginTop, height-marginBottom])
            .padding(0.1)
            .round(true)

        const color = d3.scaleSequential()
            .domain([0, d3.max(gene.cancers, d => d.male_risk)])
            .interpolator(d3.interpolateBlues)

        const svg = d3.select(ref.current).append('svg')
            .attr("width", width)
            .attr("height", height) 
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        // Population risk - Rect 
        svg.append('g')
            .selectAll('rect')
            .data(gene.cancers)
            .join('rect')
                .attr('fill', d => color(20) )
                .attr('y', d => y(d.id) )
                .attr('x', x(0) )
                .attr('width', d => x( d.male_populationRisk) - x(0) )
                .attr('height', y.bandwidth() / 2)

        // Carried Gene Risk - Rect
        svg.append('g')
            .selectAll('rect')
            .data(gene.cancers)
            .join('rect')
                .attr('fill', d => color(25))
                .attr('y', d => y(d.id) + y.bandwidth()/2)
                .attr('x', x(0) )
                .attr('width', d=> x( d.male_risk) - x(0))
                .attr('height', y.bandwidth() / 2);
        

        // Population Risk  - Text
        svg.append('g')
                .attr('fill', 'black')
                .attr('text-anchor','start')
                .attr('transform', `translate(0,${y.bandwidth()/2 })`)
            .selectAll('text')
            .data(gene.cancers)
            .join('text')
                .attr('font-size', y.bandwidth()/4)
                .attr('x', d => x(d.male_populationRisk) )
                .attr('y', d => y(d.id) )
                // Cennter Bandwidht / 2  / 4 == move 1/4th up
                .attr('dx', 5 )
                .attr('dy', -y.bandwidth()/8 )
                .text(d => d.male_populationRisk + '%' )

        // Carried Risk  - Text
        svg.append('g')
                .attr('fill', 'black')
                .attr('text-anchor','start')
                .attr('transform', `translate(0,${y.bandwidth() })`)
            .selectAll('text')
            .data(gene.cancers)
            .join('text')
                .attr('font-size', y.bandwidth()/4)
                .attr('x', d => x(d.male_risk) )
                .attr('y', d => y(d.id) )
                .attr('dx', 5 )
                .attr('dy', -y.bandwidth()/8 )
                .text(d => d.male_risk + '%' )

        svg.append('g')
                .attr('transform', `translate(0,${marginTop})`)
            .call(d3.axisTop(x))
                .style('color', 'black')
            .call( g => g.select('.domain').remove())

        svg.append('g')
                .attr('transform', `translate(${marginLeft}, 0)`)
            .call(d3.axisLeft(y))
                .style('color', 'black')
            .call(g => g.select(".domain").remove())

        // Legends 
        let legendData = [{
            text:'Population', 
            x:-10, 
            y:height-marginBottom,
            color: color(20)
        }, {
            text:'Carried', x:-10,
            y:height-marginBottom +10,
            color: color(25)}
        ]

        let legends = svg.append('g')
            .attr('transform', `translate(${marginLeft + (width-marginLeft-marginRight)/2},${height-marginBottom})`)
        let layer1 = legends.append('g')
        let layer2 = legends.append('g')
        
        // Legends - rect
        layer2.selectAll('text')
            .data(legendData)
            .join('text')
                .attr('x', -10 )
                .attr('y', (_,i) => i*15)
                .attr('text-anchor', 'center')
                .text(d=>d.text)
        
        layer2.selectAll('text')
            .join(legendData)
            .each(function (d) { d.bbox = this.getBBox() ;})


        layer1.selectAll('rect')
            .data(legendData)
            .join('rect')
                .attr('x', d => d.bbox.x )
                .attr('y', d => d.bbox.y)
                .attr('fill', d=>d.color )
                .attr('width',d => d.bbox.width)
                .attr('height',d=> d.bbox.height )
    }

    function handleChange(e) {
        currentSelect = e.target.value
        buildGraph()
    }


    return (<div>
        <div>
            <select
                onChange={handleChange}
            >
                <option>Please choose one option</option>
                {data.map((option, index) => {
                    return <option key={index} >
                        {option.id}
                    </option>
                })}
            </select>
        </div>
        <div ref={ref}> 
        </div>
    </div>)

}