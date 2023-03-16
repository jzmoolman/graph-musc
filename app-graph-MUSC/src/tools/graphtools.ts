
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
    
    // const shrinkToFit = (line: string): string => {
    //     let measure = ctx.measureText(line)
    //     if (measure.widkkth < 10 ) {
    //         // Base case 
    //         return line + ".."
            
    //     } else {
    //         return shrinkToFit(line.slice(0,line.length-2))
    //     }
    // }

    // const scaleToFit = (line: string, scale: number): number => {
    //     ctx.font = `${scale*1.05}px Libre Franklin`
    //     let measure = ctx.measureText(line)
    //     if (measure.width > 8) {
    //         // Base case 
    //         return scale
    //     } else {
    //         return scaleToFit(line, scale*1.10)
    //     }
    // }

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

    const x = node.x?node.x:0
    let y = node.y?node.y:0
    if (nodeType === 'Organ') {
                                                                                // console.log('paint: node.nodeVal', (node as CustomNodeObject).nodeVal);
                                                                                // console.log('paint: node.nodeRelSize', (node as CustomNodeObject).nodeRelSize);
                                                                                

    }
   
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

    //nodeRelSize  = nodeRelSize*2.25
    //let lineHeight = nodeRelSize
    let lineHeight = 7*2.25

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

// export const paintNode = (node: NodeObject, color: string, ctx: CanvasRenderingContext2D, global: number)  => {
//     const _node = node as CustomNodeObject;
//     ctx.fillStyle = _node.nodeColor;
//     let x = _node.x?_node.x:0
//     let y = _node.y?_node.y:0
//     ctx.beginPath(); 
//     let nodeSizeFactor = 1
//     if (_node.nodeType === 'Organ') {
//         nodeSizeFactor = 2+ (_node as OrganNodeObject).male_risk / 100
//     }
//     ctx.arc(x, y, 5*nodeSizeFactor, 0, 2 * Math.PI, false);
//     ctx.fill()  // circle

//     ctx.fillStyle = _node.fontColor
//     ctx.font = '5px px Libre Franklin'; 
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(_node.name, x, y)  // text
// }
