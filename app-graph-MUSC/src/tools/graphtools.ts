
import { NodeObject }  from 'react-force-graph-2d'

export type Force2DData = {
    nodes : any[]
    links: any[]
}

export type CentricView = 'gene' | 'organ'
export type GraphName = 'gene-organ' | 'gene-disease' | 'gene-disease-subtype' | 'organ' | 'disease' | 'syndrome-disease' | 'syndrome-gene-disease'
export type GraphNameV2 = 'gene-organ' | 'gene-disease' | 'gene-disease-subtype' | 'organ' | 'disease' | 'syndrome-disease' | 'syndrome-gene-disease'

export type NodeType = 'Gene' | 'Organ' | 'Disease' | 'Syndrome' | 'Subtype'
export type FinalVerdict = 'Confirmed' | 'Maybe' | 'Both'

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
    // geneNode: 'Blue',
    // geneNode: '#03a9f4 ', //LightBlue
    //geneNode: '#0277bd',
    geneNode: '#01579b',
    geneFont: 'White',
    // organNode: 'Red',
    // organNode: '#b71c1c',
    organNode: '#c62828',
    organFont: 'White',
    // diseaseNode: 'Purple',
    diseaseNode: '#673ab7',
    diseaseFont: 'White',
    diseaseSubtypeNode: 'Green',
    diseaseSubtypeFont: 'White',
    // syndromeNode: '#DE970B',  // Organge 
    // syndromeNode: '#c0ca33',
    syndromeNode: '#ff5722',
    syndromeFont: 'Black', 
    nodeVal: 1,
    nodeRelSize: 7,
    scaleFont: 30, // Percentage out of 100
    fitViewPort: false
}


export const ArrayToStr = (data: string[]) => {

   


    let localFilter = '';
    data.forEach(value => { 
        if (localFilter === '') localFilter = '['
        localFilter = localFilter + '\'' + value + '\','
    })
    if (localFilter !== '') {
        localFilter = localFilter.slice(0, localFilter.length - 1);
        localFilter = localFilter + ']'
    }

    return localFilter
}

export const arrayToStrV2 = (data: string[]) => {
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

export const applyFilter = (list: string[], filter: string[]) => {
    let result : string[] = []
    if (filter.length !==  0)
        filter.forEach( (fe)=> {
            // console.log("filter list items", fe)
            list.forEach( (le)=>{
                
                // console.log(" list items", fe)
                if (fe === le)
                    result.push(fe)
            })
        })
    else 
        result = list;
    return result
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

export interface OrganNodeObject extends CustomNodeObject {
    male_risk: number
    female_risk: number
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
    organ_specialist: string
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }


export const paintNode = (
    node: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {
    
    const scaleDown = (line: string, scale: number): number => {
        ctx.font = `${scale}px Libre Franklin`
        let measure = ctx.measureText(line)
        if (measure.width < 12) {
            // Base case 
            // console.log(measure.width)
            return scale
        } else {
            return scaleDown(line, scale*0.85)
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
    let nodeRelSize = (node as CustomNodeObject).nodeRelSize * (node as CustomNodeObject).scaleFont/100
    console.log('nodeRelSize', nodeRelSize)

    const x = node.x?node.x:0
    let y = node.y?node.y:0
   
    const lines = label.split(' ')
    let lines2 = []
    for ( let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if ( nodeType === 'Gene') {
            lines2.push(spaceWords(line))
        } else  {
            lines2.push(line)
        }
    }

    let lineHeight = 7

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fontColor
    
    y = y - lineHeight*((lines2.length-1)/2)
    for ( let i = 0; i < lines2.length; i++ ) {
        let line = lines2[i]
        nodeRelSize = scaleDown(line, nodeRelSize)
        ctx.font = `${nodeRelSize}px Libre Franklin`
        ctx.fillText(line, x, y)
        y = y + (lineHeight)
    }
}

