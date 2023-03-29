import * as d3 from 'd3'
import { zcolors } from './zcolors'

const csvUrl = 'https://gist.githubusercontent.com/jzmoolman/f881f64c521dd67999799469ecc7e53d/raw/riskData'
// const csvUrl = 'https://gist.githubusercontent.com/jzmoolman/c247a548be7ff701d34eb9a668bb0e91/raw/gistfile1.txt'

function getgenes(data) {
    //  return data.filter( row => row.gene !== 'Population' )
    return  [...new Set( data.filter( row => row.gene !== 'Population')
        .map(row => (row.gene) ))
    ]
}

function getpopulationRisk(data) {
    return data.filter(row => row.gene === 'Population')
}

function flatternPopulationRisk(data) {
    let result = []
    data.forEach( (row)=>{

        const index = result.findIndex((d)=> row.cancer === d.cancer )
        if ( index === -1) {
            let tmp = {
                cancer: row.cancer,
            }
            if ( row.gender === 'Male') {
                tmp.male_risk = +row.MaxOfcr85
                tmp.female_risk = 0;
            } else if ( row.gender === 'Female') {
                tmp.female_risk = +row.MaxOfcr85
                tmp.male_risk = 0;

            }
            result.push(tmp)
        } else {
            if ( row.gender === 'Male') {
                result[index].male_risk = +row.MaxOfcr85
            } else if ( row.gender === 'Female') {
                result[index].female_risk = +row.MaxOfcr85
            }
        }
    })
    return result
}

export const geneNodes = async (onData) => {
    const data = d3.csv(csvUrl).then( d => {
        const genes = getgenes(d);
        const populationRisk = flatternPopulationRisk(getpopulationRisk(d))

     
        let nodes = genes.map( d => ({
            type:'gene',
            id:d, 
            cancers:[]
        }))

        d.forEach(row => {
            const gene_index = nodes.findIndex(d=> d.id === row.gene)
            if ( gene_index === -1) {
                //skip over invalit data
                return
            }
            
            const cancer_index = nodes[gene_index].cancers.findIndex(d=> d.id === row.cancer)
            if ( cancer_index === -1) {
                const population = populationRisk.find(d => d.cancer === row.cancer )
                const cancer = {
                    type:'cancer',
                    id: row.cancer,
                    male_populationRisk:  population?population.male_risk:0,
                    female_populationRisk:  population?population.female_risk:0,
                }
                    
                if ( row.gender === 'Male' ) {
                    cancer.male_risk = +row.MaxOfcr85
                    cancer.female_risk = 0
                } else if ( row.gender === 'Female' ) {
                    cancer.male_risk = 0
                    cancer.female_risk = +row.MaxOfcr85
                }
                nodes[gene_index].cancers.push(cancer)
            } else {
                if ( row.gender === 'Male' ) {
                    nodes[gene_index].cancers[cancer_index].male_risk = +row.MaxOfcr85
                } else if ( row.gender === 'Female' ) {
                    nodes[gene_index].cancers[cancer_index].female_risk = +row.MaxOfcr85
                }
            }

        });
        return nodes
    })

    onData(await data);
}

export const buildGeneGraph = (data) => {
    let nodes = []
    let cancerNodes = []
    let links = [] 
    nodes = data.map( gene => {
        gene.cancers.forEach(  cancer => {
            cancerNodes.push({ 
                type:'cancer', 
                color:zcolors[0][0],
                clipColor:zcolors[0][1],
                size:30,
                ...cancer,
                id: gene.id + '_' + cancer.id,
                name: cancer.id
            })
            links.push(
                {
                    source: gene.id,
                    target: gene.id + '_' + cancer.id, 
                }
            )
        })
        
        return { 
            type:'gene', 
            id: gene.id,
            name: gene.id,
            color:zcolors[1][1],
            clipColor:zcolors[1][1],
            size:30,
        }
     })
     nodes = [...nodes, ...cancerNodes]

    return {nodes, links}
}

export const buildGeneGraphV2 = (data) => {
    let nodes = []
    let organNodes = []
    let links = [] 
    nodes = data.map( gene => {
        gene.organs.forEach(  organ => {
            organNodes.push({ 
                type:'organ', 
                color:zcolors[0][0],
                clipColor:zcolors[0][1],
                size:30,
                ...organ,
                id: gene.name + '_' + organ.name,
                name: organ.name
            })
            links.push(
                {
                    source: gene.name,
                    target: gene.name + '_' + organ.name, 
                }
            )
        })
        
        return { 
            type:'gene', 
            id: gene.name,
            name: gene.name,
            color:zcolors[1][1],
            clipColor:zcolors[1][1],
            size:30,
        }
     })
     nodes = [...nodes, ...organNodes]
    console.log('----> Debug: 5')
    return {nodes, links}
}
