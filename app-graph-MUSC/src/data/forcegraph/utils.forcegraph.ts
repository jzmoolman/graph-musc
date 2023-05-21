import { NodeObject } from "react-force-graph-2d"
import { Node } from "./types.forcegraph"

        function trimWord(ctx:CanvasRenderingContext2D ,word: string, width: number) {
            let measure = ctx.measureText(word)
            if (measure.width < width) {
                // Word fit nothing to do
                return word
            }
            let result = word.slice(0,-1)
            // console.log('trimword result', result)
            // return word
            let i = 0
            while (true) {
                // console.log('while loop', i)
                i++
                if ( i > 50) break
                let measure = ctx.measureText(result + '...')
                if (measure.width < width) {
                    break
                }
                if (result.length < 2) break
                result = result.slice(0,-1);
            }
            return result + '...';
        }

export const paintNode = (
    nodeObject: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {

    // console.log('---->Debug: paintNode')
    const node = nodeObject as Node
    console.log('---->Debug: node', node)
    console.log('Global', GlobalScale )
    // console.log('node.size', node.size )

    const x = node.x?node.x:0
    let y = node.y?node.y:0

    // Draw border
    let nodeRelSize = 6 //  NodeRelSize 
    ctx.fillStyle = (node as { stroke: string }).stroke
    ctx.beginPath()
    ctx.arc(x, y, nodeRelSize, 0, 2 * Math.PI, false)
    // ctx.fillStyle = 'rgb(255,255,255,0)'
    // ctx.fill()
    ctx.lineWidth = 1/GlobalScale
    ctx.strokeStyle = (node as { stroke: string }).stroke
    ctx.stroke()

    // Draw text
    let fontSize 
    let width = nodeRelSize * 2 - 2; // Alloaw some space for the border
    if( GlobalScale < 3) {
        fontSize = node.size/nodeRelSize  
    } else if (GlobalScale > 3  && GlobalScale < 6) {
       fontSize = (node.size/nodeRelSize)/(GlobalScale/3)
    } else {
        //  fontSize = (node.size/10)
       fontSize = (node.size/nodeRelSize)/(6/3)
    }

    // fontSize = node.size/nodeRelSize  
    console.log('node.size', fontSize )
    ctx.font = `${fontSize}px Libre Franklin`
   
    const words = (nodeObject as { name : string}).name.split(' ')
    // console.log('words', words )
    let lines = []
    let line = ''
    words.forEach( word => {
        let tmpLine = line===''?word: line + ' ' + word
        let measure = ctx.measureText(tmpLine)
        // console.log('GlobalScale',GlobalScale )
        if (measure.width < width) {
            line = tmpLine
        } else {
            if ( line !== '' ) {
                lines.push(trimWord(ctx,line, width))
                line = word 
            } else {
                //single word line and is to long for node
                // Trim and add ...
                lines.push(trimWord(ctx, word, width))
                line = ''
            } 
        }
    })

    if (line !== '') {
        lines.push(trimWord(ctx, line, width))
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    // ctx.fillStyle = (node as { stroke: string }).stroke


    
    // only display the first two lines
    ctx.fillStyle = 'rgb(60,60,60)'
    ctx.font = `600 ${fontSize}px Libre Franklin`
    if (lines.length === 1) {
        ctx.fillText(lines[0], x, y)
    } else if (lines.length === 2) {
        ctx.fillText(lines[0], x, y-fontSize/2)
        ctx.fillText(lines[1], x, y+fontSize/2)
    } else {
        ctx.fillText(lines[0], x, y-fontSize/2)
        ctx.fillText(lines[1], x, y+fontSize/2)
        ctx.fillText('...', x, y+fontSize)
    }
}