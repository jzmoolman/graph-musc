
import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { axisTop } from "d3";


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart
    // Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart

export function GeneRiskChart({data}) {
        const ref = useRef(null);

        useEffect( ()=>   {
            buildGraph();
        }, [])

    function buildGraph({
        marginTop = 30, // the top margin, in pixels
        marginRight = 0, // the right margin, in pixels
        marginBottom = 30, // the bottom margin, in pixels
        marginLeft = 60, // the left margin, in pixels
        width = 740, // the outer width of the chart, in pixel
        height = 200, // the outer height of the chart, in pixels
    } = {}) {
        // Prepare data for Graph
        const atm = data.find(d=> d.id === 'ATM')
        console.log('ATM', atm)

        const x = d3.scaleLinear()
            .domain([0,100])
            .range([marginLeft, width-marginRight])
            .interpolate(d3.interpolateRound)

        const y = d3.scaleBand()
            .domain(atm.cancers.map( d=> d.id))
            .range([marginTop, height-marginBottom])
            .padding(0.1)
            .round(true)

        const color = d3.scaleSequential()
            .domain([0, d3.max(atm.cancers, d => d.male_risk)])
            .interpolator(d3.interpolateBlues)

        const svg = d3.select(ref.current).append('svg')
            .attr("width", width)
            .attr("height", height) 
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        // Population risk  
        svg.append('g')
            .selectAll('rect')
            .data(atm.cancers)
            .join('rect')
                .attr('fill', d => color(d.male_populationRisk) )
                .attr('y', d => y(d.id) )
                .attr('x', x(0) )
                .attr('width', d => x( d.male_populationRisk) - x(0))
                .attr('height', y.bandwidth() / 2);

        // Carried Gene Risk
        svg.append('g')
            .selectAll('rect')
            .data(atm.cancers)
            .join('rect')
                .attr('fill', d=> color(d.male_risk))
                .attr('y', d=> y(d.id)) + y.bandwidth/2
                .attr('x', x(0) )
                .attr('width', d=> x( d.male_risk) - x(0))
                .attr('height', y.bandwidth());

        svg.append('g')
                .attr('fill', 'white')
                .attr('text-anchor','end')
                .attr('transform', `translate(-6,${y.bandwidth()/2})`)
            .selectAll('text')
            .data(atm.cancers)
            .join('text')
                .attr('y', d => y(d.id) )
                .attr('x', d => x(d.male_risk) )
                .attr('dy', "0.35em")
                .text(d => d.male_risk )

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
        }


    return (<>
        <div ref={ref}>
        </div>
    </>)

}