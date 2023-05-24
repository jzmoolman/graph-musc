
import { GraphData } from "react-force-graph-2d";
import { defaultGraphSchemeV2, GeneNode, GREY_FILL, GREY_STROKE, Node, OrganGenderNode, OrganNode, OrganPenetranceNode } from "./types.forcegraph"
import { GeneAffectOrgan, GeneAffectPenetranceOrgan  } from "../neo4j/gene-_-organ.neo4j";
import { Organ } from "../organ.neo4j";
import { Penetrance  } from "../neo4j/_relationships_.neo4j";

export const build_gene_affect_organ_forcegraph2d = (data:GeneAffectOrgan[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    data.forEach(gene_affect_organ => {
        let node
        node = result.nodes.find(d => d.id === gene_affect_organ.gene.id )

        let geneNode: GeneNode 
        if (node) {
            geneNode = node as GeneNode
        } else {
            geneNode = {
                group: 'Gene',
                type : 'gene',
                fill: defaultGraphSchemeV2.gene_fill,
                stroke:defaultGraphSchemeV2.gene_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'middle',
                proportions: [],
                ...gene_affect_organ.gene
            }
            result.nodes.push(geneNode)
        }


        node = result.nodes.find( d => d.id == gene_affect_organ.organ.id)
        let organNode: OrganNode

        if (node) {
            organNode = node as OrganNode
        } else {
            organNode =  {
                group: 'Organ',
                type: 'organ',
                fill:defaultGraphSchemeV2.organ_fill,
                stroke:defaultGraphSchemeV2.organ_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'auto-start-end',
                proportions: [],
                ...gene_affect_organ.organ
            }
            result.nodes.push(organNode)
        }
        result.links.push( {source: geneNode.id, target: organNode.id})
    })

    return result
}

const scale_size = ( size: number, ratio: number) => {
    // console.log('---->Debug: size, percetange', size, ratio)
    const DEAULT_AREA = Math.PI*Math.pow(size,2)
    return size*.20 + Math.sqrt(DEAULT_AREA*ratio/Math.PI)  // min(r) = r*0.1
}

// forcegraph without 2d is part of own forcegraph component
export interface OrganRisk extends Organ {
    has_risk: boolean,
    gender: string,
    risk: number,
    population_gender: string,      // . Temp to make data integrity.  Should match gender
    population_risk: number,
}

export const build_gene_affecs_risk_organ_forcegraph = (gender: string, data: GeneAffectPenetranceOrgan[]) => {
    // console.log('---->Debug: build_gene_affecs_risk_organ_forcegraph', data)

    let result : GraphData = { 
        nodes: [],
        links: [],
    }

    data.forEach(gene_affect_risk_organ => {
        let node
        node = result.nodes.find( d => d.id === gene_affect_risk_organ.gene.id )

        let geneNode: GeneNode
        if (node) {
            geneNode = node as GeneNode
        } else {
            geneNode = {
                group: 'Gene',
                type : 'circle',
                fill: defaultGraphSchemeV2.gene_fill,
                stroke:defaultGraphSchemeV2.gene_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'middle',
                proportions: [],
                ...gene_affect_risk_organ.gene
            }
            result.nodes.push(geneNode)
        }

        if (gene_affect_risk_organ.relation.type === 'AFFECT') {
            // OrganNode represent an organ without prenetrence
            
            node = result.nodes.find(d => d.id === gene_affect_risk_organ.relation.id )
            let organGenderNode: OrganGenderNode
            if (node) {
                organGenderNode = node as OrganGenderNode
            } else {
                organGenderNode = {
                    original_id: gene_affect_risk_organ.organ.id,
                    group: 'Organ',
                    type : 'triangle',
                    fill: GREY_FILL,
                    stroke: GREY_STROKE,
                    nodeSize: 30/2, // Show the trianle node small in relation to the other type of nodes
                    fontSize: 10,
                    text_anchor: 'auto-start-end',
                    gender: gene_affect_risk_organ.relation.gender,
                    proportions: [],
                    ...gene_affect_risk_organ.organ,
                    id:gene_affect_risk_organ.relation.id 
                }
                result.nodes.push(organGenderNode)
            } 
            result.links.push( {source: geneNode.id, target: organGenderNode.id})
        }
        

        if (gene_affect_risk_organ.relation.type === 'RISK') {
            // //OrganPrentrenceNode split the organ up into spereate uniqie organ with risk representation
            // //Change db name of RISK to Penetrance
            node = result.nodes.find(d => (d as OrganPenetranceNode).id === gene_affect_risk_organ.relation.id)
            let organPenetranceNode: OrganPenetranceNode
            if (node) {
                // Do nothing
                // Should not occure
                organPenetranceNode = node as OrganPenetranceNode
            } else {
                const penetrance = gene_affect_risk_organ.relation as Penetrance
                // console.log('---->Debug: gene-_organ.forcegraph penetrance', penetrance)
                organPenetranceNode = {
                    original_id: gene_affect_risk_organ.organ.id,
                    group: 'OrganPenetrance',
                    type : 'circle-fill',
                    fill: defaultGraphSchemeV2.organ_fill,
                    stroke:defaultGraphSchemeV2.organ_stroke,
                    // nodeSize: scale_size(30, penetrance.population_risk/penetrance.risk),
                    nodeSize: scale_size(30, penetrance.risk/100),
                    // nodeSize: 30,
                    fontSize: 16,
                    text_anchor: 'auto-start-end',
                    proportions: [{
                        label: 'Penetrance',
                        value: penetrance.population_risk/penetrance.risk,
                        color: defaultGraphSchemeV2.organ_stroke,
                    },{
                        label: 'Fill',
                        // value: 1 - penetrance.risk/100,
                        // value: penetrance.population_risk/penetrance.risk,
                        value: 1-penetrance.population_risk/penetrance.risk,
                        color: defaultGraphSchemeV2.organ_fill,
                    }],
                    ...gene_affect_risk_organ.organ,
                    penetrance: gene_affect_risk_organ.relation as Penetrance,
                    // Override id and type
                    id: gene_affect_risk_organ.relation.id
                }
                result.nodes.push(organPenetranceNode)
                result.links.push( {source: geneNode.id, target: organPenetranceNode.id})
            }
        }
    })
    // console.log('---->Debug: result', result)
    return result
}
