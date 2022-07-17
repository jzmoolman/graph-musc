
import { ForceGraphMethods, NodeObject }  from 'react-force-graph-2d'

export type ColorScheme = {
    geneNodeColor: string
    geneFontColor: string
    organNodeColor: string
    organFontColor: string
    syndromeNodeColor: string
    syndromeFontColor: string
}
export const defualtColorScheme: ColorScheme = {
        geneNodeColor: 'blue',
        geneFontColor: 'white',
        organNodeColor: 'red',
        organFontColor: 'white',
        syndromeNodeColor: 'yellow',
        syndromeFontColor: 'black'
}

interface exNodeObject  {
    name: string
    fontColor: string
}

export const paintNode = (node: NodeObject, ctx: CanvasRenderingContext2D, GlobalScale: number) => {
    const label = (node as exNodeObject).name
    const fontColor = (node as exNodeObject).fontColor

    const fontSize = 12 / 12 * 1.5

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