
import { GraphData, NodeObject } from "react-force-graph-2d";

import { Gene_OrganRisks, Gene_Organs, OrganRisk } from "./gene-organ.neo4j";
import { Gene } from "./gene.neo4j";
import { defaultGraphScheme } from "../tools/graphtools";
import { Organ } from "./organ.neo4j";

//The definition will move to a spereate file 
export type Node = NodeObject  & {
    type: string,
    fill: string,
    stroke: string,
    size: number,
    //attr
    text_anchor: string,
    // Experiment
    proportions : {
        label: string,
        value: number,
        color: string
    }[]
}

export type GeneNode = Gene & Node & {
};

export type OrganNode = Organ & Node & {
};

export type OrganRiskNode = OrganRisk & Node & {

};

export const build_gene_affects_organ_graph = (data:Gene_Organs[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    let geneNode: GeneNode 
    data.forEach(row => {
        geneNode = {
            type : 'gene',
            fill: 'red',
            stroke: defaultGraphScheme.geneFont,
            size: 30,
            text_anchor: 'middle',
            proportions: [],
            ...row.gene
        }
        result.nodes.push(geneNode)

        row.organs.forEach( organ => { 
            let node = result.nodes.find( _node => {
                if ( (_node as Node).type == 'organ' && (_node as OrganNode).name === organ.name) {
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
                    type: 'organ',
                    fill: 'blue',
                    stroke: defaultGraphScheme.geneFont,
                    size: 30,
                    text_anchor: 'auto-start-end',
                    proportions: [],
                    ...organ
                }
                result.nodes.push(organNode)
            }
            result.links.push( {source: geneNode.name, target: organNode.name})
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

const RED_Fill = 'rgb(225,111,108)' //Light red
const RED_STROKE = 'rgb(155,75,76)' //Dark red
const BLUE_FILL = 'rgb(117,197,224)'
const BLUE_STROKE = 'rgb(75,126,143)'

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

    console.log('---->Debug: build_gene_affecs_risk_organ_graph', data)

    let geneNode: GeneNode 
    data.forEach(row => {
        // console.log('---->Debug: row', row)
        geneNode = {
            type : 'gene',
            fill: BLUE_FILL,
            stroke: BLUE_STROKE,
            size: 30,
            proportions: [],
            text_anchor: 'middle',
            ...row.gene
        }
        result.nodes.push(geneNode)

        row.organs.forEach( organ => { 
            let node = result.nodes.find( _node => {
                if ( (_node as Node).type == 'organ' && (_node as OrganRiskNode).name === organ.name) {
                    return true
                } else {
                    return false;
                }
            })
            let organRiskNode: OrganRiskNode
            if (node) {
                organRiskNode = node as OrganRiskNode
            } else {
                organRiskNode =  {
                    type: 'organ',
                    fill: organ.has_risk?RED_Fill:'grey',
                    stroke: organ.has_risk?RED_STROKE:'rgb(95,94,94)',
                    size: organ.has_risk?scale_size(30, organ.population_risk/organ.risk):30,
                    text_anchor: 'auto-start-end',

                    proportions: [{
                        label: 'Risk',
                        value: organ.risk/100,
                        color: RED_STROKE,
                    },{
                        label: 'Whole',
                        value: 1-organ.risk/100,
                        color: RED_Fill,
                    }],
                    // proportions: [],
                    ...organ as OrganRisk,
                
                }
                result.nodes.push(organRiskNode)
            }
            result.links.push( {source: geneNode.name, target: organRiskNode.name})
        })
    })
    // console.log('---->Debug: result', result)
    return result
}

