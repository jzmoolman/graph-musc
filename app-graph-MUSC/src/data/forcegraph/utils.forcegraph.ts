import { NodeObject } from "react-force-graph-2d"
import { Node } from "./types.forcegraph"

export const paintNode = (
    nodeObject: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {
    
    // console.log('---->Debug: paintNode')
    // console.log('nodeObject', nodeObject )
    const node = nodeObject as Node


    let fontSize 
    let widthSize = 12
    if( GlobalScale < 3) {
        fontSize = node.size/9 // Fits atleast 6 characters  
    } else if (GlobalScale > 3  && GlobalScale < 6) {
        let scalefont = GlobalScale-3
        if (scalefont > 3 ) {
            scalefont = 3
        }
       fontSize = (node.size/(9-scalefont))/(GlobalScale/3)
    } else {
        //  fontSize = (node.size/10)
        fontSize = 2.5 
    }
    console.log('fontSize', fontSize)

    widthSize = 12

        function trimWord(word: string) {
            let measure = ctx.measureText(word)
            if (measure.width < widthSize) {
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
                if (measure.width < widthSize) {
                    break
                }
                if (result.length < 2) break
                result = result.slice(0,-1);
            }
            return result + '...';
        }
    


    ctx.font = `${fontSize}px Libre Franklin`
   
    const words = (nodeObject as { name : string}).name.split(' ')
    // console.log('words', words )
    let lines = []
    let line = ''
    words.forEach( word => {
        let tmpLine = line===''?word: line + ' ' + word
        let measure = ctx.measureText(tmpLine)
        // console.log('GlobalScale',GlobalScale )
        if (measure.width < widthSize) {
            line = tmpLine
        } else {
            if ( line !== '' ) {
                lines.push(trimWord(line))
                line = word 
            } else {
                //single word line and is to long for node
                // Trim and add ...
                lines.push(trimWord(word))
                line = ''
            } 
        }
    })

    if (line !== '') {
        lines.push(trimWord(line))
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'
    // ctx.fillStyle = (node as { stroke: string }).stroke
    const x = node.x?node.x:0
    let y = node.y?node.y:0

    // Draw border
    ctx.fillStyle = (node as { stroke: string }).stroke
    ctx.beginPath()
    ctx.arc(x, y, 7, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'rgb(255,255,255,0)'
    ctx.fill()
    ctx.lineWidth = 0.5
    ctx.strokeStyle = (node as { stroke: string }).stroke
    ctx.stroke()

    
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