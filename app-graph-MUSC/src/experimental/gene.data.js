import * as d3 from 'd3'

// const csvUrl = 'https://gist.githubusercontent.com/jzmoolman/f881f64c521dd67999799469ecc7e53d/raw/riskData'
const csvUrl = 'https://gist.githubusercontent.com/jzmoolman/c247a548be7ff701d34eb9a668bb0e91/raw/gistfile1.txt'
export const gene_data = async (onData) => {
    const data = d3.csv(csvUrl).then( d => {
        let genes =  [...new Set(d.map(item => {
            return  item.gene
        }))];
        let nodes = genes.map(row => {
            const  proportions = [{ group:1, value: 1}];
            return { type:'gene', id:row, color:'red', size:30, proportions}
        })
        let links = [];

        d.forEach(row => {
            if (row.gender === 'Male') {
                const  proportions = [{ group:1, value: row.MaxOfcr85*10}, 
                                      { group:2, value: 1000-(row.MaxOfcr85*10)}, 

                    ];

                nodes.push({ type:'organ', id:row.cancer, color:'blue', size:30 , proportions})
                links.push({source: row.gene, target:row.cancer, risk:row.MaxOfcr85, distance: 160,})
            }

        });
        return {nodes, links}
    })
    onData(await data);
}

