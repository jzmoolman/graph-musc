import * as d3 from 'd3'
import { colors2 } from './colors'

// const csvUrl = 'https://gist.githubusercontent.com/jzmoolman/f881f64c521dd67999799469ecc7e53d/raw/riskData'
const csvUrl = 'https://gist.githubusercontent.com/jzmoolman/c247a548be7ff701d34eb9a668bb0e91/raw/gistfile1.txt'
export const gene_data = async (onData) => {
    const data = d3.csv(csvUrl).then( d => {
        let genes =  [...new Set(
            d.filter( item => item.gene !== 'Population')
            .map(item => { 
                return  item.gene 
            }
        ))];
        let nodes = genes.map(row => {
            const  proportions = [{ group:1, value: 1}
                                  ];
            return { 
                type:'gene', id:row,
                color:colors2[1][0],
                clipColor:colors2[1][1],
                size:30,
                proportions}
        })
        let links = [];
        d.filter(row => row.gene !== 'Population').forEach(row => {
            if (row.gender === 'Male') {
                const  proportions = [{ group:1, value: row.MaxOfcr85*10}, 
                                      { group:2, value: 1000-(row.MaxOfcr85*10)}, 

                    ];
                const populations = d.filter( d=> d.gene === 'Population' && d.cancer === row.cancer && d.gender === 'Male')
                    .map( d=>d.MaxOfcr85)
                let population  = null;
                populations? population = +populations[0] :population = null

                nodes.push({ 
                    type:'organ', 
                    id:row.cancer, 
                    color:colors2[0][0],
                    clipColor:colors2[0][1],
                    size:30,
                    proportions,
                    population})

                links.push({source: row.gene, target:row.cancer, risk:row.MaxOfcr85, distance: 160,})
            }

        });
        return {nodes, links}
    })
    onData(await data);
}


export const gene_data = async (onData) => {
    const data = d3.csv(csvUrl).then( d => {
        let genes =  [...new Set(
            d.filter( item => item.gene !== 'Population')
            .map(item => { 
                return  item.gene 
            }
        ))];
        let nodes = genes.map(row => {
            const  proportions = [{ group:1, value: 1}
                                  ];
            return { 
                type:'gene', id:row,
                color:colors2[1][0],
                clipColor:colors2[1][1],
                size:30,
                proportions}
        })
        let links = [];
        d.filter(row => row.gene !== 'Population').forEach(row => {
            if (row.gender === 'Male') {
                const  proportions = [{ group:1, value: row.MaxOfcr85*10}, 
                                      { group:2, value: 1000-(row.MaxOfcr85*10)}, 

                    ];
                const populations = d.filter( d=> d.gene === 'Population' && d.cancer === row.cancer && d.gender === 'Male')
                    .map( d=>d.MaxOfcr85)
                let population  = null;
                populations? population = +populations[0] :population = null

                nodes.push({ 
                    type:'organ', 
                    id:row.cancer, 
                    color:colors2[0][0],
                    clipColor:colors2[0][1],
                    size:30,
                    proportions,
                    population})

                links.push({source: row.gene, target:row.cancer, risk:row.MaxOfcr85, distance: 160,})
            }

        });
        return {nodes, links}
    })
    onData(await data);
}