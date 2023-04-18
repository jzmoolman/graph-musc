
import { GraphData } from 'react-force-graph-2d'
import { GeneCauseDisease } from './gene-cause-disease.neo4j'
import { DiseaseNode, GeneNode, defaultGraphSchemeV2 } from './types.forcegraph'


export const build_gene_disease_graph_2d = (data:GeneCauseDisease[])  => {
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
                size: 30,
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
                size: 30,
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