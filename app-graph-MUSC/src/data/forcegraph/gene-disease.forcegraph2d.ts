
import { GraphData } from 'react-force-graph-2d'
import { GeneCauseDisease } from '../neo4j/gene-cause-disease.neo4j'
import { DiseaseNode, GeneNode, SubtypeNode, defaultGraphSchemeV2 } from './types.forcegraph'

export const build_gene_disease_forcegraph2d = (data:GeneCauseDisease[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    data.forEach(gene_cause_disease => {
        let node
        node = result.nodes.find( d => d.id === gene_cause_disease.gene.id)

        let geneNode: GeneNode
        if (node) {
            geneNode = node as GeneNode
        } else {
            geneNode = {
                group: 'Gene',
                type : 'gene',
                fill: defaultGraphSchemeV2.gene_fill,
                stroke:defaultGraphSchemeV2.gene_stroke,
                size: 16,
                text_anchor: 'middle',
                proportions: [],
                ...gene_cause_disease.gene
            }
            result.nodes.push(geneNode)
        }

        node = result.nodes.find( d => d.id === gene_cause_disease.disease.id)
        let diseaseNode: DiseaseNode
        if (node) {
            diseaseNode = node as DiseaseNode
        } else {
            diseaseNode = {
                group: 'Disease',
                type : 'disease',
                fill: defaultGraphSchemeV2.disease_fill,
                stroke:defaultGraphSchemeV2.disease_stroke,
                size: 16,
                text_anchor: 'middle',
                proportions: [],
                ...gene_cause_disease.disease
            }
            result.nodes.push(diseaseNode)
        }
        // The relationship can more 1 or more, Check and handle use case
        result.links.push( {source: geneNode.id, target: diseaseNode.id})
    })
    return result
}


export const build_gene_disease_subtype_foregraph2d = (data:GeneCauseDisease[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    data.forEach(gene_cause_disease => {
        let node
        node = result.nodes.find( d => d.id === gene_cause_disease.gene.id)

        let geneNode: GeneNode
        if (node) {
            geneNode = node as GeneNode
        } else {
            geneNode = {
                group: 'Gene',
                type : 'gene',
                fill: defaultGraphSchemeV2.gene_fill,
                stroke:defaultGraphSchemeV2.gene_stroke,
                size: 16,
                text_anchor: 'middle',
                proportions: [],
                ...gene_cause_disease.gene
            }
            result.nodes.push(geneNode)
        }

        node = result.nodes.find( d => d.id === gene_cause_disease.disease.id)
        let diseaseNode: DiseaseNode
        if (node) {
            diseaseNode = node as DiseaseNode
        } else {
            diseaseNode = {
                group: 'Disease',
                type : 'disease',
                fill: defaultGraphSchemeV2.disease_fill,
                stroke:defaultGraphSchemeV2.disease_stroke,
                size: 16,
                text_anchor: 'middle',
                proportions: [],
                ...gene_cause_disease.disease
            }
            result.nodes.push(diseaseNode)
        }
        result.links.push( {source: geneNode.id, target: diseaseNode.id})

        node = result.nodes.find( d=> d.id === gene_cause_disease.cause.id)
        let subtypeNode: SubtypeNode
        if (node) {
            subtypeNode = node as SubtypeNode
            result.links.push( {source: diseaseNode.id, target: subtypeNode.id})
        } else {
            if (gene_cause_disease.cause.predominantCancerSubType !== 'Unknown') {
                console.log('---->Debug:build_gene_disease_subtype_foregraph2d gene_cause_disease', gene_cause_disease)

                subtypeNode = { 
                    group: 'Subtype',
                    type: 'subtype',
                    fill: defaultGraphSchemeV2.subtype_fill, 
                    stroke: defaultGraphSchemeV2.subtype_stroke, 
                    size: 16,
                    text_anchor: 'middle',
                    proportions: [],
                    id: gene_cause_disease.cause.id,
                    name: gene_cause_disease.cause.predominantCancerSubType,
                }
                result.nodes.push(subtypeNode)
                result.links.push( {source: diseaseNode.id, target: subtypeNode.id})
            } 
        }
        
    })
    return result
}