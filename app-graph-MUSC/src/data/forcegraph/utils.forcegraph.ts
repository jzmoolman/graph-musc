import { NodeObject } from "react-force-graph-2d"
import { Node } from "./types.forcegraph"

export const paintNode = (
    nodeObject: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {
    
    console.log('---->Debug: paintNode')
    console.log('nodeObject', nodeObject )
    const node = nodeObject as Node
    const fontSize = node.size/10 //default node Size  is 30
   
    const words = (nodeObject as { name : string}).name.split(' ')
    // console.log('words', words )
    let lines = []
    let line = ''
    words.forEach( word => {
        ctx.font = `${fontSize}px Libre Franklin`
        let tmpLine = line===''?word: line + ' ' + word
        let measure = ctx.measureText(tmpLine)
        // console.log('measure.width', measure.width/GlobalScale )
        if (measure.width < 15) {
            console.log('tmpLine', tmpLine )
            line = tmpLine
        } else {
            if ( line !== '' ) {
                //single word is to long for node
                // Trim and add ...
                lines.push(line)
            }
            line = word 
        }
    })

    if (line !== '') {
        lines.push(line)
    }

    console.log('lines', lines )

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    ctx.fillStyle = (node as { stroke: string }).stroke
    const x = node.x?node.x:0
    let y = node.y?node.y:0
    
    // only display the first two lines
    if (lines.length === 1) {
        ctx.font = `${fontSize}px Libre Franklin`
        ctx.fillText(lines[0], x, y)
    } else if (lines.length === 2) {
        ctx.font = `${fontSize}px Libre Franklin`
        ctx.fillText(lines[0], x, y-fontSize/2)
        ctx.fillText(lines[1], x, y+fontSize/2)
    } else {
        ctx.font = `${fontSize}px Libre Franklin`
        ctx.fillText(lines[0], x, y-fontSize/2)
        ctx.fillText(lines[1], x, y+fontSize/2)
        ctx.fillText('...', x, y+fontSize)
    }
}