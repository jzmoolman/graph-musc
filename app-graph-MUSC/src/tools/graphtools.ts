
import { NodeObject }  from 'react-force-graph-2d'

export type GraphScheme = {
    geneNode: string
    geneFont: string
    organNode: string
    organFont: string
    diseaseNode: string
    diseaseFont: string
    diseaseSubtypeNode: string
    diseaseSubtypeFont: string
    syndromeNode: string
    syndromeFont: string
    nodeVal: number,
    nodeRelSize: number
    scaleFont: number
    fitViewPort: boolean
}

export const defaultGraphScheme: GraphScheme = {
    geneNode: 'Blue',
    geneFont: 'White',
    organNode: 'Red',
    organFont: 'White',
    diseaseNode: 'Purple',
    diseaseFont: 'White',
    diseaseSubtypeNode: 'Green',
    diseaseSubtypeFont: 'White',
    // syndromeNode: '#E8E10C',       '#DE970B' 
    syndromeNode: '#DE970B',  // Organge 
    syndromeFont: 'Black', 
    nodeVal: 1,
    nodeRelSize: 7,
    scaleFont: 30, // Percentage out of 100
    fitViewPort: false
}

export type Force2DData = {
    nodes : any[]
    links: any[]
}

export type GraphName = 'gene-organ' | 'gene-disease' | 'gene-disease-subtype' | 'organ' | 'disease' | 'syndrome-disease' | 'syndrome-gene-disease'

export const ArrayToStr = (data: string[]) => {
    let localFilter = '';
    data.forEach(value => { 
        if (localFilter === '') localFilter = '['
            localFilter = localFilter + '\'' + value + '\','
        } )
        if (localFilter !== '') {
            localFilter = localFilter.slice(0, localFilter.length - 1);
            localFilter = localFilter + ']'
        }
    return localFilter
}
 
export interface CustomNodeObject extends NodeObject {
    name: string
    nodeType: string
    nodeColor: string
    fontColor: string
    nodeVal: number
    nodeRelSize: number
    scaleFont: number
}

export interface GeneNodeObject extends CustomNodeObject {
    fullName: string
    altName: string
    description: string
}

export interface SyndromeNodeObject extends CustomNodeObject {
    hereditaryType: string
}

export interface SubtypeNodeObject extends CustomNodeObject {
    disease: string
}

export const paintNode = (node: NodeObject, ctx: CanvasRenderingContext2D, GlobalScale: number) => {
    const label = (node as CustomNodeObject).name
    const fontColor = (node as CustomNodeObject).fontColor
    const fontSize = (node as CustomNodeObject).nodeRelSize * (node as CustomNodeObject).scaleFont/100

    const x = node.x?node.x:0
    let y = node.y?node.y:0

    const lines = label.split(' ')
    const lineHeight  = fontSize

    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fontColor
    
    y = y - lineHeight*((lines.length-1)/2)
    for ( let i = 0; i < lines.length; i++ ) {
        ctx.fillText(lines[i], x, y)
        y = y + (lineHeight)
    }
}
