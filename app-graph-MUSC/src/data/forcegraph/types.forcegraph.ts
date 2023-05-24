import { NodeObject } from "react-force-graph-2d";
import { Gene } from "../gene.neo4j";
import { Organ } from "../organ.neo4j";
import { Disease } from "../disease.neo4j";
import { Syndrome } from "../syndrome.neo4j";
import { Subtype } from "../subtype.data";
import { Penetrance } from "../neo4j/_relationships_.neo4j";



export type Node = NodeObject  & {
    group: string,
    type: string,
    fill: string,
    stroke: string,
    fontSize: number,
    nodeSize: number, // Only used by forcegraph
    //attr
    text_anchor: string,
    // Experiment
    proportions : {
        label: string,
        value: number,
        color: string
    }[]
}


export const RED_FILL = 'rgb(225,111,108)' //Light red
export const RED_STROKE = 'rgb(155,75,76)' //Dark red
export const BLUE_FILL = 'rgb(117,197,224)'
export const BLUE_STROKE = 'rgb(75,126,143)'
export const YELLOW_FILL = 'rgb(249,224,141)'
export const YELLOW_STROKE = 'rgb(199,179,113)'
export const GREEN_FILL = 'rgb(170,215,191)'
export const GREEN_STROKE = 'rgb(136,172,152)'
export const GREY_FILL = 'rgb(95, 95, 95)'
export const PEACH_FILL = 'rgb(249,220,195)'
export const PEACH_STROKE = 'rgb(246,192,148)'
export const GREY_STROKE = 'rgb(40, 40, 40)'
export const GREY_A_FILL = 'rgba(40, 40, 40, 0.50)'

export type GraphSchemeV2 = {
    gene_fill: string
    gene_stroke: string
    organ_fill: string
    organ_stroke: string
    disease_fill: string
    disease_stroke: string
    syndrome_fill: string
    syndrome_stroke: string
    subtype_fill: string,
    subtype_stroke: string,
}

export const defaultGraphSchemeV2: GraphSchemeV2 = {
    gene_fill: BLUE_FILL,
    gene_stroke: BLUE_STROKE,
    organ_fill: RED_FILL,
    organ_stroke: RED_STROKE,
    disease_fill: YELLOW_FILL,
    disease_stroke: YELLOW_STROKE,
    syndrome_fill: GREEN_FILL,
    syndrome_stroke: GREEN_STROKE,
    subtype_fill: PEACH_FILL,
    subtype_stroke: PEACH_STROKE,
}

export type GeneNode = Gene & Node 
export type OrganNode = Organ & Node
export type OrganGenderNode = Organ & Node & {
    original_id: string,
    gender: string,
}
export type OrganPenetranceNode = Organ  & Node & {
    original_id: string,
    penetrance: Penetrance,
}
export type DiseaseNode = Disease & Node
export type SyndromeNode = Syndrome & Node
export type SubtypeNode =  Subtype & Node