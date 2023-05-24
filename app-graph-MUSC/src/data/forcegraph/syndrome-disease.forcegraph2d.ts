
import { GraphData } from "react-force-graph-2d";
import { SyndromeNode,DiseaseNode, defaultGraphSchemeV2, GeneNode } from "./types.forcegraph";
import { SyndromeGeneCauseDisease } from "../neo4j/syndryome-gene-disease.neo4j";



export const build_syndrome_disease = (data:SyndromeGeneCauseDisease[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    data.forEach(syndrome_gene_caused_disease => {
        let node
        node = result.nodes.find( d => d.id === syndrome_gene_caused_disease.syndrome.id)

        let syndromeNode: SyndromeNode
        if (node) {
            syndromeNode = node as SyndromeNode
        } else {
            syndromeNode = {
                group: 'Syndrome',
                type : 'syndrome',
                fill: defaultGraphSchemeV2.syndrome_fill,
                stroke:defaultGraphSchemeV2.syndrome_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'middle',
                proportions: [],
                ...syndrome_gene_caused_disease.syndrome
            }
            result.nodes.push(syndromeNode)
        }
        
        node = result.nodes.find( d => d.id === syndrome_gene_caused_disease.disease.id)
        let diseaseNode: DiseaseNode
        if (node) {
            diseaseNode = node as DiseaseNode
        } else {
            diseaseNode = {
                group: 'Disease',
                type : 'disease',
                fill: defaultGraphSchemeV2.disease_fill,
                stroke:defaultGraphSchemeV2.disease_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'middle',
                proportions: [],
                ...syndrome_gene_caused_disease.disease
            }
            result.nodes.push(diseaseNode)
        }
        result.links.push( {source: syndromeNode.id, target: diseaseNode.id})
    })
    return result
}

export const build_syndrome_gene_disease = (data:SyndromeGeneCauseDisease[])  => {
    let result : GraphData = { 
        nodes: [],
        links: [],
    }
    data.forEach(syndrome_gene_caused_disease => {
        let node
        node = result.nodes.find( d => d.id === syndrome_gene_caused_disease.syndrome.id)

        let syndromeNode: SyndromeNode
        if (node) {
            syndromeNode = node as SyndromeNode
        } else {
            syndromeNode = {
                group: 'Syndrome',
                type : 'syndrome',
                fill: defaultGraphSchemeV2.syndrome_fill,
                stroke:defaultGraphSchemeV2.syndrome_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'middle',
                proportions: [],
                ...syndrome_gene_caused_disease.syndrome
            }
            result.nodes.push(syndromeNode)
        }

        node = result.nodes.find( d => d.id === syndrome_gene_caused_disease.disease.id)
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
                ...syndrome_gene_caused_disease.gene
            }
            result.nodes.push(geneNode)
        }
        
        node = result.nodes.find( d => d.id === syndrome_gene_caused_disease.disease.id)
        let diseaseNode: DiseaseNode
        if (node) {
            diseaseNode = node as DiseaseNode
        } else {
            diseaseNode = {
                group: 'Disease',
                type : 'disease',
                fill: defaultGraphSchemeV2.disease_fill,
                stroke:defaultGraphSchemeV2.disease_stroke,
                nodeSize: 30,
                fontSize: 16,
                text_anchor: 'middle',
                proportions: [],
                ...syndrome_gene_caused_disease.disease
            }
            result.nodes.push(diseaseNode)
        }
        result.links.push( {source: syndromeNode.id, target: geneNode.id})
        result.links.push( {source: geneNode.id, target: diseaseNode.id})
    })
    return result
}