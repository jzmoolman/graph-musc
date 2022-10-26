
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
export type NodeType = 'Gene' | 'Organ' | 'Disease' | 'Syndrome' | 'Subtype'

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
    nodeType: NodeType
    name: string
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

export interface cardNCCNTableObject {
    gender: string
    modality: string
    recommendation: string
}

export interface cardNCCNDataObject {
    organ: string
    data: cardNCCNTableObject[]
    footnote: string
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }


export const paintNode = (node: NodeObject, ctx: CanvasRenderingContext2D, GlobalScale: number) => {
    
    const shrinkToFit = (line: string): string => {
        let measure = ctx.measureText(line)
        if (measure.width < 13) {
            // Base case 
            return line
        } else {
            return shrinkToFit(line.slice(0,line.length-2))
        }
    }

    const scaleToFit = (line: string, scale: number): number => {
        ctx.font = `${scale*1.05}px Libre Franklin`
        let measure = ctx.measureText(line)
        if (measure.width > 8) {
            // Base case 
            return scale
        } else {
            return scaleToFit(line, scale*1.10)
        }
    }

    const spaceWords = (line: string ) => {
        let r = ""
        for ( let i = 0; i < line.length; i++) {
           r = r + line[i]
           if (i+1 != line.length)
           r += " " 
        }
        return r
    }

    const nodeType = (node as CustomNodeObject).nodeType
    const label = (node as CustomNodeObject).name
    const fontColor = (node as CustomNodeObject).fontColor
    const fontSize = (node as CustomNodeObject).nodeRelSize * (node as CustomNodeObject).scaleFont/100

    const x = node.x?node.x:0
    let y = node.y?node.y:0

    const lines = label.split(' ')
    let lines2 = []
    for ( let i = 0 ; i< lines.length; i++) {
        let line = lines[i]
        if ( nodeType === 'Gene') {
            lines2.push(spaceWords(line))
        } else  {
            lines2.push(line)
        }
    }
    
    let lineHeight  = fontSize
    if ( nodeType === 'Gene') {
        lineHeight = fontSize*1.2
    }

    ctx.font = `${lineHeight}px Libre Franklin`
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fontColor
    
    y = y - lineHeight*((lines2.length-1)/2)
    for ( let i = 0; i < lines2.length; i++ ) {
        let measure = ctx.measureText(lines2[i])
        let line = ''
        if (measure.width > 15) {
            line = shrinkToFit(lines2[i])
        } else {
            line =  lines2[i]
            if ( lines2.length == 1) {
                lineHeight = scaleToFit(lines2[i], lineHeight)
                ctx.font = `${lineHeight}px Libre Franklin`
                line =  lines2[i]
            }
        }
        
        ctx.fillText(line, x, y)
        y = y + (lineHeight)
    }
}
