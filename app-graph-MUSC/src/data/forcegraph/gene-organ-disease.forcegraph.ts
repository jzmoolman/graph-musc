
import { GraphData } from "react-force-graph-2d";
import { DiseaseNode, Node } from "./types.forcegraph";

import { Gene_OrganDiseases } from "../gene-organdiseases.ne04j_0001";
import { GeneNode, OrganNode, defaultGraphSchemeV2 } from "./types.forcegraph";

// General Affect collect all organs with no risk data 
// Used with Force-Graph-2d
export const build_gene_organ_disease_graph = (data:Gene_OrganDiseases[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    let geneNode: GeneNode 
    data.forEach(gene_organdiseases => {
        geneNode = {
            group: 'Gene',
            type : 'gene',
            fill: defaultGraphSchemeV2.gene_fill,
            stroke: defaultGraphSchemeV2.gene_stroke,
            size: 16,
            text_anchor: 'middle',
            proportions: [],
            ...gene_organdiseases.gene
        }
        result.nodes.push(geneNode)

        gene_organdiseases.organdiseases.forEach( organ_disease => { 
            let node = result.nodes.find( d => {
                if ( (d as Node).group == 'Organ' && (d as OrganNode).id === organ_disease.organ.id) {
                    return true
                } else {
                    return false;
                }
            })
            let organNode: OrganNode
            if (node) {
                organNode = node as OrganNode
            } else {
                organNode =  {
                    group:'Organ',
                    type: 'organ',

                    fill: defaultGraphSchemeV2.organ_fill,
                    stroke: defaultGraphSchemeV2.organ_stroke,
                    size: 16,
                    text_anchor: 'auto-start-end',
                    proportions: [],
                    ...organ_disease.organ
                }
                result.nodes.push(organNode)
            }
            result.links.push( {source: geneNode.id, target: organNode.id})

            node = result.nodes.find( _node => {
                if ( (_node as Node).group == 'Disease' && (_node as DiseaseNode).id === organ_disease.disease.id) {
                    return true
                } else {
                    return false;
                }
            })
            let diseaseNode: DiseaseNode
            if (node) {
                diseaseNode = node as DiseaseNode
            } else {
                diseaseNode =  {
                    group:'Disease',
                    type: 'disease',

                    fill: defaultGraphSchemeV2.disease_fill,
                    stroke: defaultGraphSchemeV2.disease_stroke,
                    size: 16,
                    text_anchor: 'auto-start-end',
                    proportions: [],
                    ...organ_disease.disease
                }
                result.nodes.push(diseaseNode)
            }
            result.links.push( {source: organNode.id, target: diseaseNode.id})
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

// const scale_size = ( size: number, ratio: number) => {
//     // console.log('---->Debug: size, percetange', size, ratio)
//     const DEAULT_AREA = Math.PI*Math.pow(size,2)
//     return size*.20 + Math.sqrt(DEAULT_AREA*ratio/Math.PI)  // min(r) = r*0.1
// }

// export const build_gene_affecs_risk_organ_graph = (data: Gene_OrganRisks[]) => {

//     let result : GraphData = { 
//         nodes: [],
//         links: [],
//     }

//     console.log('---->Debug: build_gene_affecs_risk_organ_graph', data)

//     let geneNode: GeneNode 
//     data.forEach(row => {
//         // console.log('---->Debug: row', row)
//         geneNode = {
//             type : 'gene',
//             fill: BLUE_FILL,
//             stroke: BLUE_STROKE,
//             size: 30,
//             proportions: [],
//             text_anchor: 'middle',
//             ...row.gene
//         }
//         result.nodes.push(geneNode)

//         row.organs.forEach( organ => { 
//             let node = result.nodes.find( _node => {
//                 if ( (_node as Node).type == 'organ' && (_node as OrganRiskNode).name === organ.name) {
//                     return true
//                 } else {
//                     return false;
//                 }
//             })
//             let organRiskNode: OrganRiskNode
//             if (node) {
//                 organRiskNode = node as OrganRiskNode
//             } else {
//                 organRiskNode =  {
//                     type: 'organ',
//                     fill: organ.has_risk?RED_Fill:'grey',
//                     stroke: organ.has_risk?RED_STROKE:'rgb(95,94,94)',
//                     size: organ.has_risk?scale_size(30, organ.population_risk/organ.risk):30,
//                     text_anchor: 'auto-start-end',

//                     proportions: [{
//                         label: 'Risk',
//                         value: organ.risk/100,
//                         color: RED_STROKE,
//                     },{
//                         label: 'Whole',
//                         value: 1-organ.risk/100,
//                         color: RED_Fill,
//                     }],
//                     // proportions: [],
//                     ...organ as OrganRisk,
                
//                 }
//                 result.nodes.push(organRiskNode)
//             }
//             result.links.push( {source: geneNode.name, target: organRiskNode.name})
//         })
//     })
//     // console.log('---->Debug: result', result)
//     return result
// }

