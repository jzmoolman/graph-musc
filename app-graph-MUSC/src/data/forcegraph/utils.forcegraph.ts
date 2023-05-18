import { NodeObject } from "react-force-graph-2d"
import { Node } from "./types.forcegraph"

export const paintNode = (
    nodeObject: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {
    
    // console.log('---->Debug: paintNode')
    // console.log('nodeObject', nodeObject )
    const node = nodeObject as Node


    let fontSize = node.size/10 //default node Size  is 30
    let widthSize = 12
    
    if (GlobalScale > 4 && GlobalScale < 6) {
        fontSize = node.size/13
        widthSize = 14
    } else if ( GlobalScale > 6) {
        fontSize = node.size/GlobalScale

    }

    fontSize = node.size/2/GlobalScale
    if (GlobalScale < 3 ) {
        fontSize = node.size/10
    }
    

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