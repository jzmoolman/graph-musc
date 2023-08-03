
import { useEffect, useRef , useState} from "react"
import * as d3 from "d3"

// import './ForceGraph.css'
import { buildForceGraph } from "../packagesz/forcegraphz"
// import { GraphData, NodeObject } from "react-force-graph-2d"
import { mydata } from "./data"

const DEBUG=1



export const TestForceGraph = () => {
    console.log("---->Debug: TestForceGraph")
    console.log("---->Debug: mydata", mydata)

    const ref = useRef(null);
    let node 
    const [currentNode, setCurrentNode] = useState<any>(node)

    useEffect( ()=>   {
        console.log("---->Debug: ref", ref)
        console.log("---->Debug: ref.current", ref.current)
        //Don't see the point on doing this, this will only be called once on startup
        // d3.select(ref.current)
        //     .selectAll('*')
        //     .remove()
        buildGraph();

    }, [])

    const handleMouseEnter = (d:any)  => {
        console.log('---->Debug: TestForceGraph handlemouseenter', d, typeof d)
        setCurrentNode(d)
    }
    
    const handleMouseLeave = (d:any)  => {
        console.log('---->Debug: TestForceGraph andlemouseleave', d)
        setCurrentNode(null)
    }
    
    const buildGraph = () => {
        console.log('---->Debug: TestForceGraph.buildGraph')
        const svg = d3.select(ref.current)
        console.log('---->Debug: width', svg.style('width'))
        let tmp = +svg.style('width')
        if ( Number.isNaN(tmp)) {
            tmp = 0;
        }

        const dcx = -tmp/4
        console.log('---->Debug: dcx', dcx)
        // do i need to pass through cx and cy can i calculate it inside
        buildForceGraph(svg, mydata.nodes, mydata.links, handleMouseEnter, handleMouseLeave, dcx, 0)
    }

    return (<>
        <div id='GeneRiskGraph-Container' 
            style={DEBUG?{
                // position: 'absolute',
                position: 'relative',
                top: '10px',
                right: '10px',
                bottom: '10px',
                border: '3px solid #73AD21',
                minWidth: '500px'
            }:{
                position: 'relative',
                border: '1px solid #73AD21',
                minWidth: '500px'
            }
        }  
        >
            <svg  
                width={'100%'}
                height={'500'}
                style={DEBUG?{
                    border: '3px solid red',
                }:{
                    border: '0px',
                }
            }
                id="graph-contrainer"
                ref={ref}
            >
            </svg>
        </div>
    </>)
}

