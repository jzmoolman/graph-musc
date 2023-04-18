
import { GraphData } from "react-force-graph-2d";
import { defaultGraphSchemeV2, GeneNode, GREY_FILL, GREY_STROKE, Node, OrganNode, OrganRiskNode } from "./types.forcegraph"
import { Gene_OrganRisks, Gene_Organs, OrganRisk } from "./gene-organ.neo4j";

export const build_gene_affects_organ_graph = (data:Gene_Organs[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    let geneNode: GeneNode 
    data.forEach(row => {
        geneNode = {
            group: 'Gene',
            type : 'gene',
            fill: defaultGraphSchemeV2.gene_fill,
            stroke:defaultGraphSchemeV2.gene_stroke,
            size: 30,
            text_anchor: 'middle',
            proportions: [],
            ...row.gene
        }
        result.nodes.push(geneNode)

        row.organs.forEach( organ => { 
            let node = result.nodes.find( d => d.id == organ.id)
            let organNode: OrganNode
            if (node) {
                organNode = node as OrganNode
            } else {
                organNode =  {
                    group: 'Organ',
                    type: 'organ',
                    fill:defaultGraphSchemeV2.organ_fill,
                    stroke:defaultGraphSchemeV2.organ_stroke,
                    size: 30,
                    text_anchor: 'auto-start-end',
                    proportions: [],
                    ...organ
                }
                result.nodes.push(organNode)
            }
            result.links.push( {source: geneNode.id, target: organNode.id})
        })
    })

    return result
}

// build_gene_affects_risk_organ_graph

  /*
            scale - scaleRadius
            |------|------|------|
            0      r/2    R      s*r/2      | where s is scaleFactor, in this case is 1
                   min Scale     Max scale

                   Replace with new method 
        */

        // function scaleRadius(r,s,p)  {
        //     return r/2 + s*r*p;
        // }
        
        // function scaleRadiusv2(r,p)  {
        //     return Math.sqrt((1+p)*r*r);
        // }
        
        /* 
            r = max radius
            p | where between 0 and 1 and represent the % of scale applied to r
        */



const scale_size = ( size: number, ratio: number) => {
    // console.log('---->Debug: size, percetange', size, ratio)
    const DEAULT_AREA = Math.PI*Math.pow(size,2)
    return size*.20 + Math.sqrt(DEAULT_AREA*ratio/Math.PI)  // min(r) = r*0.1
}

export const build_gene_affecs_risk_organ_graph = (data: Gene_OrganRisks[]) => {

    let result : GraphData = { 
        nodes: [],
        links: [],
    }

    // console.log('---->Debug: build_gene_affecs_risk_organ_graph', data)

    let geneNode: GeneNode 
    data.forEach(row => {
        geneNode = {
            group: 'Gene',
            type : 'circle',
            fill: defaultGraphSchemeV2.gene_fill,
            stroke:defaultGraphSchemeV2.gene_stroke,
            size: 30,
            proportions: [],
            text_anchor: 'middle',
            ...row.gene
        }
        result.nodes.push(geneNode)

        row.organs.forEach( (organ, i) => { 
           
            let organRiskNode: OrganRiskNode =  {
                group: 'Organ',
                type: organ.has_risk?'circle-fill':'triangle',
                fill: organ.has_risk?defaultGraphSchemeV2.organ_fill:GREY_FILL,
                stroke: organ.has_risk?defaultGraphSchemeV2.organ_stroke:GREY_STROKE,
                size: organ.has_risk?scale_size(30, organ.population_risk/organ.risk):30,
                text_anchor: 'auto-start-end',

                proportions: organ.has_risk?[{
                    label: 'Risk',
                    value: organ.risk/100,
                    color: defaultGraphSchemeV2.organ_stroke,
                },{
                    label: 'Whole',
                    value: 1-organ.risk/100,
                    color: defaultGraphSchemeV2.organ_fill,
                }]:[],
                ...organ as OrganRisk,
            }
            organRiskNode.id = organRiskNode.id + i
            result.nodes.push(organRiskNode)
            result.links.push( {source: geneNode.id, target: organRiskNode.id})
        })
    })
    // console.log('---->Debug: result', result)
    return result
}

