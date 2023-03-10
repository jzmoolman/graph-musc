

import { useEffect, useRef } from "react"
import * as d3 from "d3"

const DEBUG_ON = 0

export function GeneRiskChart({data, gene, gender}) {
        const ref = useRef(null);

    console.log('Debug: GeneriskChart')
    let currentGeneSelect = gene
    let currentGenderSelect = gender
    console.log('Debug: currentGeneSelect', currentGeneSelect)
    console.log('Debug: currentGenderSelect', currentGenderSelect)

    useEffect( ()=>   {
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        buildGraph();
    }, [currentGenderSelect, currentGeneSelect])

    function buildGraph({
        marginTop = 30, // the top margin, in pixels
        marginRight = 10, // the right margin, in pixels
        marginBottom = 60, // the bottom margin, in pixels
        marginLeft = 90, // the left margin, in pixels
        width = 500, // the outer width of the chart, in pixel
        height = 600, // the outer height of the chart, in pixels

    } = {}) {

        if (!currentGeneSelect || !currentGenderSelect) return

        const gene = data.find( d => d.id === currentGeneSelect )

        let filterCancers = gene.cancers.filter(cancer => {
            if ( currentGenderSelect === 'male') {
                cancer.risk = (d) => {
                    return +d.male_risk
                }
                cancer.populationRisk = (d) => {
                    return +d.male_populationRisk
                }
                if ( +cancer.male_populationRisk !== 0) {
                    return true
                } else {
                    return false
                }
            } else if ( currentGenderSelect === 'female') {
                cancer.risk = (d) => {
                    return +d.female_risk
                }
                cancer.populationRisk = (d) => {
                    return +d.female_populationRisk
                }
                if ( +cancer.female_populationRisk !== 0) {
                    return true
                } else {
                    return false
                }
            } else {
                // Data invalid format: gender option 1 -> male
                //                      gender option 2 -> female
                return false
            }
        })

        const x = d3.scaleLinear()
            .domain([0,100])
            .range([marginLeft, width-marginRight])
            .interpolate(d3.interpolateRound)
        
        const y_bandwidth = 50 
        const y_padding = 0.1
        // Calculate the height required for chart
        height = marginTop + filterCancers.length*(y_bandwidth + y_padding) + marginBottom
        console.log('height', height)


        const y = d3.scaleBand()
            .domain(filterCancers.map( d=> d.id))
            .range([marginTop, height-marginBottom])
            .padding(y_padding)
            .round(true)
        console.log('y.bandwidth()', y.bandwidth())

        const color = d3.scaleSequential()
            .domain([0, d3.max(filterCancers, d => d.male_risk)])
            .domain([0, 40])
            .interpolator(d3.interpolateBlues)

        const svg = d3.select(ref.current).append('svg')
            .attr("width", width)
            .attr("height", height) 
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        // Population risk - Rect 
        svg.append('g')
            .selectAll('rect')
            .data(filterCancers)
            .join('rect')
                .attr('fill', d => color(20) )
                .attr('y', d => y(d.id) )
                .attr('x', x(0) )
                .attr('width', d => x( d.populationRisk(d)) - x(0) )
                .attr('height', y.bandwidth() / 2)

        // Carrier Gene Risk - Rect
        svg.append('g')
            .selectAll('rect')
            .data(filterCancers)
            .join('rect')
                .attr('fill', d => color(25))
                .attr('y', d => y(d.id) + y.bandwidth()/2)
                .attr('x', x(0) )
                .attr('width', d=> x( d.risk(d)) - x(0))
                .attr('height', y.bandwidth()/2);
        

        // Population Risk  - Text
        svg.append('g')
                .attr('fill', 'black')
                .attr('text-anchor','start')
                .attr('transform', `translate(0,${y.bandwidth()/2 })`)
            .selectAll('text')
            .data(filterCancers)
            .join('text')
                .attr('font-size', y.bandwidth()/4)
                .attr('x', d => x(d.populationRisk(d)) )
                .attr('y', d => y(d.id) )
                // Cennter Bandwidht / 2  / 4 == move 1/4th up
                .attr('dx', 5 )
                .attr('dy', -y.bandwidth()/8 )
                .text(d => d.populationRisk(d) + '%' )

        // Carrier Risk  - Text
        svg.append('g')
                .attr('fill', 'black')
                .attr('text-anchor','start')
                .attr('transform', `translate(0,${y.bandwidth() })`)
            .selectAll('text')
            .data(filterCancers)
            .join('text')
                .attr('font-size', y.bandwidth()/4)
                .attr('x', d => x(d.risk(d)) )
                .attr('y', d => y(d.id) )
                .attr('dx', 5 )
                .attr('dy', -y.bandwidth()/8 )
                .text(d => d.risk(d) + '%' )

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
            text:'Carrier', x:-10,
            y:height-marginBottom +12,
            color: color(25)}
        ]

        let legends = svg.append('g')
            .attr('transform', `translate(${marginLeft + (width-marginLeft-marginRight)/2},${height-marginBottom})`)
        let layer1 = legends.append('g')
        let layer2 = legends.append('g')
        
        // Legends - rect
        
        const fontSize = 14
        const bHeight = 16

        layer2.selectAll('text')
            .data(legendData)
            .join('text')
                .attr('font-size', fontSize )
                .attr('x', 26 )
                .attr('y', (_,i) => i*bHeight +  bHeight/2) // shift fontsize + index down
                .attr('dy', '0.35em')
                .attr('text-anchor', 'start')
                .text(d=>d.text)
        
        layer1.selectAll('rect')
            .data(legendData)
            .join('rect')
                .attr('x', 0  )
                .attr('y', (d,i) => i*bHeight)
                .attr('fill', d=>d.color )
                .attr('width', 24)
                .attr('height', bHeight-0.5)

        // Y-axis Additional descriiptions
        svg.append('g')
                .attr('transform',`translate( 16,${height/2})rotate(-90)`)
            .append('text')
                .attr('font-size', fontSize)
                // .attr('x', 0)
                // .attr('y', height/2)
            .text('Cancer')
        
        // X-axis Additional descriiptions
        svg.append('g')
                .attr('text-anchor','start')
            .append('text')
                .attr('font-size', fontSize)
                .attr('x',  marginLeft)
                .attr('y',  height - marginTop + 20)
            .text(`${currentGenderSelect==='male'?'Male':'Female'} ${currentGeneSelect} cancer risk between the ages 25 and 85 `)

        // X-axis Additional descriiptions
        svg.append('g')
            .append('rect')
                .attr('fill', 'rgba(0,0,0,0)')
                .attr('stroke', '#2378ae')
                .attr('x', 0 )
                .attr('y', 0)
                .attr('width', width)
                .attr('height', height)
            .text(`${currentGenderSelect==='male'?'Male':'Female'} ${currentGeneSelect} cancer risk between the ages 25 and 85 `)
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

    
    return (<div>
        {DEBUG_ON?
        <div>
            <select
                onChange={handleGeneChange}
            >
                <option>Please choose one option</option>
                {data.map((option, index) => {
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
        <div ref={ref}> 
        </div>
    </div>)

}