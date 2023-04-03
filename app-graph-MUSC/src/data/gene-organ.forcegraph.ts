
import { GraphData, NodeObject } from "react-force-graph-2d";

import { Gene_OrganRisks, Gene_Organs, OrganRisk } from "./gene-organ.neo4j";
import { Gene } from "./gene.neo4j";
import { defaultGraphScheme } from "../tools/graphtools";
import { Organ } from "./organ.neo4j";

//The definition will move to a spereate file 
export type Node = NodeObject  & {
    type: string,
    color: string,
    fontColor: string,
    size: number,
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
            color: 'red',
            fontColor: defaultGraphScheme.geneFont,
            size: 30,
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
                    color: 'blue',
                    fontColor: defaultGraphScheme.organFont,
                    size: 30,
                    ...organ
                }
                result.nodes.push(organNode)
            }
            result.links.push( {source: geneNode.name, target: organNode.name})
        })
    })

    return result
}

export const build_gene_affecs_risk_organ_graph = (data: Gene_OrganRisks[]) => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }

    console.log('---->Debug: build_gene_affecs_risk_organ_graph')


    let geneNode: GeneNode 
    data.forEach(row => {
        geneNode = {
            type : 'gene',
            color: 'red',
            fontColor: defaultGraphScheme.geneFont,
            size: 30,
            ...row.gene
        }
        result.nodes.push(geneNode)

        row.organs.forEach( organ => { 
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
                        color: 'blue',
                        fontColor: defaultGraphScheme.organFont,
                        size: 30,
                        ...organ as OrganRisk,
                    }
                    result.nodes.push(organRiskNode)
                }
                result.links.push( {source: geneNode.name, target: organRiskNode.name})
            })
            
        })
    })
    // gene.cancers.forEach(  cancer => {
    //     cancerNodes.push({ 
    //         clipColor:zcolors[0][1],
    //         id: gene.id + '_' + cancer.id,
    //         name: cancer.id
    //     })
    //     links.push(
    //         {
    //             source: gene.id,
    //             target: gene.id + '_' + cancer.id, 
    //         }
    //     )
    // })
    return result
}

