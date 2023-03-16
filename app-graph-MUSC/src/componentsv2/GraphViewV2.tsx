import { DevView } from "../experimental/DevView" 
import ForceGraph2D, { ForceGraphMethods,  } from 'react-force-graph-2d'
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Box, Typography } from "@mui/material"
import { CentricView, GraphNameV2 } from "../tools/graphtools"

type Options = {
    centricView: CentricView,
    graphName: GraphNameV2,
    specialist: string,
    
}

export const GraphViewV2 = () => {

    const forceRef : MutableRefObject<ForceGraphMethods | undefined> = useRef()      
    const ref = useRef<HTMLInputElement>(null)
    const [dim, setDim] = useState({width: 0, height:0})
        
    useEffect(()=> {
        window.addEventListener("resize", handleResize )
        const width = ref.current?ref.current.offsetWidth:0
        // const height = ref.current?ref.current.offsetHeight:0
        const height = 600
        setDim({width, height})
    }, [])

    const handleResize = () => {
        const width = ref.current?ref.current.offsetWidth:0
        // const height = ref.current?ref.current.offsetHeight:0
        const height = 600
        setDim({width, height})
    }

    let handleEngineStop: ()=>void | undefined = () => {
        if (forceRef.current) {
            (forceRef.current as ForceGraphMethods).zoomToFit(400);
        }
    }

    return (<>
        <DevView>
                <Box 
                    // id='Grapview'
                    ref={ref}
                    sx={{
                        border: '1px solid blue',
                    }}
                    >
                    <ForceGraph2D 
                        ref={forceRef}
                        width={dim.width}
                        height={dim.height}
                        graphData={{
                            nodes: [{ id: "zach"}, {id: "piet"}],
                            links: [{source:"zach", target: "piet"}]

                        }}
                        nodeId='id'  
                        // nodeColor='nodeColor' 
                        // nodeLabel='name' 
                        linkDirectionalArrowRelPos={1} 
                        linkDirectionalArrowLength={2} 
                        cooldownTicks={100}
                        onEngineStop={handleEngineStop}
                        // nodeVal={graphScheme.nodeVal}
                        // nodeRelSize={graphScheme.nodeRelSize}
                        nodeCanvasObjectMode={() => 'after'}
                        // nodeCanvasObject={paintNode}
                        // onNodeClick={handleNodeClick}
                        // onNodeHover={handleNodeHover}
                        enableZoomInteraction={true}
                    />                 
                    <Box sx={{
                            position:'absolute',
                            top: 10,
                            right: 10,
                            width: 300,
                            background:'black'
                        }}
                    > 
                        <Typography color='primary.main'>
                            <span> TEST DEV VIEW</span>
                        </Typography>
                    </Box> 
                </Box>
        </DevView> 

    </>)

}