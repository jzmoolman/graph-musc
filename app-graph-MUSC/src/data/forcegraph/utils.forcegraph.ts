import { NodeObject } from "react-force-graph-2d"
import { Node } from "./types.forcegraph"

export const paintNode = (
    nodeObject: NodeObject, 
    ctx: CanvasRenderingContext2D, 
    GlobalScale: number) => {
    
    // console.log('---->Debug: paintNode')
    // console.log('nodeObject', nodeObject )
    const node = nodeObject as Node


    let fontSize = node.size/2 //default node Size  is 30
    let widthSize = 12
    // A    
    if (GlobalScale < 3 ) {
        fontSize = node.size/3/3
    } else if (GlobalScale > 3 && GlobalScale < 9) {
        //reverse scale affect, fonrt remain the same size
        // fontSize = node.size/3/GlobalScale
        fontSize = node.size/3/3
    } else {
        // fontSize = node.size/3/GlobalScale
        fontSize = node.size/3/3
    }
    // B
    if (GlobalScale < 3 ) {
        fontSize = node.size/4/GlobalScale   // 12

    } else if (GlobalScale > 3 && GlobalScale < 10) {
        let fontScale = (GlobalScale-3)/6  // % for scaling text
        fontSize = node.size/(4-(fontScale*2) )/GlobalScale            // 6
    } else {
        // Now scale the GlobalScale
        let scale = GlobalScale-9+1             // % for scaling text
        if (9/scale < 1)
          scale = 9

        fontSize = node.size/1/(9/scale)        // 6
        fontSize = node.size/30        // 6
    }

    //c
    if ( GlobalScale <= 1) {
        console.log('GLOBAL SCALE', GlobalScale)
        fontSize = node.size/node.size   // 12

    } else if (GlobalScale < 3 ) {
        fontSize = node.size/4/3   // 12

    } else if (GlobalScale > 4 && GlobalScale < 15) {
        let fontScale = (GlobalScale-3)/6  // % for scaling text
        fontSize = node.size/(4-(fontScale*2) )/GlobalScale            // 6

    } else {
        // Now scale the GlobalScale
        let scale = GlobalScale-15+1             // % for scaling text
        if (9/scale < 1)
          scale = 9

        fontSize = node.size/1/(9/scale)        // 6
        fontSize = node.size/30        // 6
    }
    //D 
    console.log('GLOBAL SCALE', GlobalScale)
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
    ctx.fillStyle = 'rgb(60,60,60)'
    const x = node.x?node.x:0
    let y = node.y?node.y:0
    
    // only display the first two lines
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