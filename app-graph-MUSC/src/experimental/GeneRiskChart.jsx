

import { useEffect, useRef } from "react"
import * as d3 from "d3"

const DEBUG_ON = 0

export function GeneRiskChart({
    gender,               
    onGenderChange,             
    data, // gene,
}) {

    console.log('---->Debug: GeneRiskChart', data)

    const ref = useRef(null);

    let currentGender = gender  

    let filteredData = filterGender(currentGender, data)

    function filterGender(gender, data) {
        console.log('---->Debug: GeneRiskChart filterGender gender', gender)
        console.log('---->Debug: GeneRiskChart filterGender data', data)
        let result = {
            ...data,
            organs: data.organs.filter( organ =>  organ.gender === gender || organ.gender === 'Either')
        }
        console.log('---->Debug: GeneRiskChart filterGender data', result)
        return result
    }

    useEffect( ()=>   {
        d3.select(ref.current)
            .selectAll('*')
            .remove()
        filteredData = filterGender(gender, data)               // jmh changed to gender
        buildGraph();
    }, [])

    function buildGraph({
        marginTop = 30, // the top margin, in pixels
        marginRight = 10, // the right margin, in pixels
        marginBottom = 60, // the bottom margin, in pixels
        marginLeft = 90, // the left margin, in pixels
        width = 700, // the outer width of the chart, in pixel
        height = 500, // the outer height of the chart, in pixels

    } = {}) {
        console.log('---->Debug buildGraph height', height)

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height) 
            // .attr("viewBox", [0, 0, width, height])
            // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        const gene = data

        const x = d3.scaleLinear()
            .domain([0,100])
            .range([marginLeft, width-marginRight])
            .interpolate(d3.interpolateRound)
        
        const y_bandwidth = 60 
        const y_padding = 0.1
        // Calculate the height required for chart
        // Get back to use this 
        let virtual_height = marginTop + filteredData.organs.length*(y_bandwidth + y_padding) + marginBottom
        
        const y = d3.scaleBand()
            .domain(filteredData.organs.map( d=> d.name))
            .range([marginTop, virtual_height-marginBottom])
            .padding(y_padding)
            .round(true)
        console.log('y.bandwidth()', y.bandwidth())

        const color = d3.scaleSequential()
            //male risk is wrong shoud be risk
            .domain([0, d3.max(filteredData.organs, d => d.male_risk)])
            .domain([0, 40])
            .interpolator(d3.interpolateBlues)


        // Population risk - Rect 
        svg.append('g')
            .selectAll('rect')
            .data(filteredData.organs)
            .join('rect')
                .attr('fill', d => color(20) )
                .attr('y', d => y(d.name) )
                // .attr('y', (d,i) => marginTop+ i*y_bandwidth+2 )
                .attr('x', x(0) )
                .attr('width', d => x(d.population_risk) - x(0) )
                .attr('height', y.bandwidth() / 2)
                // .attr('height', y_bandwidth / 2 -4)

        // Carrier Gene Risk - Rect
        svg.append('g')
            .selectAll('rect')
            .data(filteredData.organs)
            .join('rect')
                .attr('fill', d => color(25))
                .attr('y', d => y(d.name) + y.bandwidth()/2)
                // .attr('y', (d,i) => marginTop + i*(y_bandwidth+2) + y_bandwidth/2 )
                .attr('x', x(0) )
                .attr('width', d=> x( d.risk) - x(0))
                .attr('height', y.bandwidth()/2);
                // .attr('height', y_bandwidth/2 -4);
        

        // Population Risk  - Text
        svg.append('g')
                .attr('fill', 'black')
                .attr('text-anchor','start')
                .attr('transform', `translate(0,${y.bandwidth()/2 })`)
                // .attr('transform', `translate(0,${y_bandwidth/2 })`)
            .selectAll('text')
            .data(filteredData.organs)
            .join('text')
                .attr('font-size', y.bandwidth()/3)
                // .attr('font-size', y_bandwidth/4)
                .attr('x', d => x(d.population_risk))
                // .attr('y', d => y(d.name) )
                .attr('y', (d,i) => marginTop+ i*y_bandwidth+2 )
                // Cennter Bandwidht / 2  / 4 == move 1/4th up
                .attr('dx', 5 )
                .attr('dy', -y.bandwidth()/8 )
                // .attr('dy', -y_bandwidth/8 )
                .text(d => d.population_risk + '%' )

        // Carrier Risk  - Text
        svg.append('g')
                .attr('fill', 'black')
                .attr('text-anchor','start')
                .attr('transform', `translate(0,${y.bandwidth() })`)
                // .attr('transform', `translate(0,${y_bandwidth })`)
            .selectAll('text')
            .data(filteredData.organs)
            .join('text')
                .attr('font-size', y.bandwidth()/3)
                // .attr('font-size', y_bandwidth/4)
                .attr('x', d => x(d.risk))
                .attr('y', d => y(d.name) )
                // .attr('y', (d,i) => marginTop + i*(y_bandwidth)-2)
                .attr('dx', 5 )
                .attr('dy', -y.bandwidth()/8 )
                // .attr('dy', -y_bandwidth/8 )
                .text(d => d.risk + '%' )

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
             .text(`${gender==='Male'?'Male':'Female'} ${data.name} organ penetrance between the ages 25 and 85 `)  // JMH changed to gender

        // X-axis Additional descriptions
        svg.append('g')
            .append('rect')
                .attr('fill', 'rgba(0,0,0,0)')
                // .attr('stroke', '#2378ae')
                .attr('x', 0 )
                .attr('y', 0)
                .attr('width', width)
                .attr('height', height)
            .text(`${gender==='Male'?'Male':'Female'} ${data.name} organ penetrance between the ages 25 and 85 `) //JMH changed to gender
    }
    
    function handleGenderChange(e) {
        currentGender = e.target.value
        onGenderChange(e.target.value) // JMH added reflect the change up the chain
              console.log('---->Debug GeneRiskChart -handleGenderChange user chose:', e.target.value)
              console.log('---->Debug GeneRiskChart -handleGenderChange gender changed to:', gender)
        console.log(e.target.value)
        d3.select(ref.current)
            .selectAll('*')
            .remove()

        filteredData = filterGender(gender, data) // JMH changed to gender 
        buildGraph()
    }
    
    return (<>
        <div id='GeneRiskChart-Container'
            style={{
                border: '1px solid #73AD21',
            }}
        >   <svg ref={ref}>
            
            </svg> 
            <div id='GeneRiskChart-Notes'
                style={{
                    textAlign: 'center'

                }}
            >
                <label htmlFor='barchar-gender-select'>Gender</label>
                <select id='barchar-gender-select'
                    value={gender}  
                    onChange={handleGenderChange}
                >
                    <option key='Male' value='Male'>Male</option>
                    <option key='Female' value='Female'>Female</option>
                </select>
            </div>
        </div> 
    </>)

}