import { NodeObject } from "react-force-graph-2d"
import { Node } from "./types.forcegraph"

export const paintNode = (
    nodeObject: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {

        function trimWord(word: string) {
            let result = word.slice(0,-1)
            console.log('trimword result', result)
            // return word
            let i = 0
            while (true) {
                console.log('while loop', i)
                i++
                if ( i > 50) break
                let measure = ctx.measureText(result + '...')
                if (measure.width < 12) {
                    break
                }
                if (result.length < 2) break
                result = result.slice(0,-1);
            }
            return result + '...';
        }
    
    console.log('---->Debug: paintNode')
    console.log('nodeObject', nodeObject )
    const node = nodeObject as Node
    const fontSize = node.size/10 //default node Size  is 30
    ctx.font = `${fontSize}px Libre Franklin`
   
    const words = (nodeObject as { name : string}).name.split(' ')
    // console.log('words', words )
    let lines = []
    let line = ''
    words.forEach( word => {
        let tmpLine = line===''?word: line + ' ' + word
        let measure = ctx.measureText(tmpLine)
        // console.log('measure.width', measure.width/GlobalScale )
        if (measure.width < 12) {
            console.log('tmpLine', tmpLine )
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